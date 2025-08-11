// server/Controllers/ChargingSessionController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Entities;
using server.Models.DTOs.ChargingSession;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChargingSessionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChargingSessionController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim);
        }

        [HttpPost]
        public async Task<IActionResult> CreateChargingSession([FromBody] CreateChargingSessionDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetCurrentUserId();

                // Validate vehicle belongs to user
                var vehicle = await _context.Vehicles
                    .FirstOrDefaultAsync(v => v.Id == dto.VehicleId && v.UserId == userId);

                if (vehicle == null)
                    return BadRequest(new { message = "Vehicle not found" });

                // Validate charging station exists
                var chargingStation = await _context.ChargingStations
                    .Include(cs => cs.Provider)
                    .FirstOrDefaultAsync(cs => cs.Id == dto.ChargingStationId);

                if (chargingStation == null)
                    return BadRequest(new { message = "Charging station not found" });

                // Validate times
                if (dto.EndTime <= dto.StartTime)
                    return BadRequest(new { message = "End time must be after start time" });

                // ✅ DateTime'ları UTC'ye çevir
                var startTimeUtc = dto.StartTime.Kind == DateTimeKind.Unspecified 
                    ? DateTime.SpecifyKind(dto.StartTime, DateTimeKind.Utc) 
                    : dto.StartTime.ToUniversalTime();

                var endTimeUtc = dto.EndTime.Kind == DateTimeKind.Unspecified 
                    ? DateTime.SpecifyKind(dto.EndTime, DateTimeKind.Utc) 
                    : dto.EndTime.ToUniversalTime();

                // Calculate duration in minutes
                var duration = (endTimeUtc - startTimeUtc).TotalMinutes;

                // Get price per minute from provider
                var pricePerMinute = chargingStation.Provider.PricePerMinute;

                // Calculate total amount
                var amount = (decimal)(duration * (double)pricePerMinute);

                // ✅ UTC DateTime kullan
                var chargingSession = new ChargingSession
                {
                    UserId = userId,
                    VehicleId = dto.VehicleId,
                    ChargingStationId = dto.ChargingStationId,
                    StartTime = startTimeUtc,  // ✅ UTC
                    EndTime = endTimeUtc       // ✅ UTC
                };

                _context.ChargingSessions.Add(chargingSession);
                await _context.SaveChangesAsync();

                // Create invoice
                var invoice = new Invoice
                {
                    ChargingSessionId = chargingSession.Id,
                    Amount = Math.Round(amount, 2)
                    // CreatedAt otomatik UTC olacak
                };

                _context.Invoices.Add(invoice);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Charging session created successfully", 
                    invoice = new { amount = invoice.Amount },
                    chargingSession = new {
                        id = chargingSession.Id,
                        startTime = chargingSession.StartTime,
                        endTime = chargingSession.EndTime,
                        durationMinutes = (int)duration
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Error creating charging session", 
                    error = ex.Message
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetUserChargingSessions()
        {
            try
            {
                var userId = GetCurrentUserId();

                var sessions = await _context.ChargingSessions
                    .Include(cs => cs.Vehicle)
                    .Include(cs => cs.ChargingStation)
                    .Include(cs => cs.Invoice)
                    .Where(cs => cs.UserId == userId)
                    .OrderByDescending(cs => cs.StartTime)
                    .Select(cs => new ChargingSessionResponseDto
                    {
                        Id = cs.Id,
                        UserId = cs.UserId,
                        VehicleId = cs.VehicleId,
                        ChargingStationId = cs.ChargingStationId,
                        StartTime = cs.StartTime,
                        EndTime = cs.EndTime,
                        DurationMinutes = (int)(cs.EndTime - cs.StartTime).TotalMinutes,
                        VehicleInfo = $"{cs.Vehicle.Make} {cs.Vehicle.Model} ({cs.Vehicle.PlateNumber})",
                        StationLocation = cs.ChargingStation.Location,
                        Invoice = cs.Invoice != null ? new InvoiceResponseDto
                        {
                            Id = cs.Invoice.Id,
                            Amount = cs.Invoice.Amount,
                            ChargingSessionId = cs.Invoice.ChargingSessionId
                        } : null
                    })
                    .ToListAsync();

                return Ok(sessions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching charging sessions", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChargingSession(int id)
        {
            try
            {
                var userId = GetCurrentUserId();

                // Find charging session belonging to current user
                var chargingSession = await _context.ChargingSessions
                    .Include(cs => cs.Invoice)
                    .FirstOrDefaultAsync(cs => cs.Id == id && cs.UserId == userId);

                if (chargingSession == null)
                    return NotFound(new { message = "Charging session not found" });

                // Delete associated invoice first (due to foreign key)
                if (chargingSession.Invoice != null)
                {
                    _context.Invoices.Remove(chargingSession.Invoice);
                }

                // Delete charging session
                _context.ChargingSessions.Remove(chargingSession);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Charging session deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting charging session", error = ex.Message });
            }
        }
    }
}