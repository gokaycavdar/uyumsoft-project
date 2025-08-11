// server/Controllers/ProviderController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Entities; // ✅ Bu satırı ekleyin
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Provider")]
    public class ProviderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProviderController(ApplicationDbContext context)
        {
            _context = context;
        }

        private async Task<int> GetCurrentProviderId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userId = int.Parse(userIdClaim);
            
            // ✅ Provider'ı UserId ile bul
            var provider = await _context.Providers
                .FirstOrDefaultAsync(p => p.UserId == userId);
            
            if (provider == null)
                throw new UnauthorizedAccessException("User is not a provider");
            
            return provider.Id;
        }

        [HttpGet("sessions")]
        public async Task<IActionResult> GetProviderSessions()
        {
            try
            {
                var providerId = await GetCurrentProviderId();

                var sessions = await _context.ChargingSessions
                    .Include(cs => cs.User)
                    .Include(cs => cs.Vehicle)
                    .Include(cs => cs.ChargingStation)
                    .Include(cs => cs.Invoice)
                    .Where(cs => cs.ChargingStation.ProviderId == providerId)
                    .OrderByDescending(cs => cs.StartTime)
                    .Select(cs => new
                    {
                        Id = cs.Id,
                        UserId = cs.UserId,
                        VehicleId = cs.VehicleId,
                        ChargingStationId = cs.ChargingStationId,
                        StartTime = cs.StartTime,
                        EndTime = cs.EndTime,
                        DurationMinutes = (int)(cs.EndTime - cs.StartTime).TotalMinutes,
                        User = new
                        {
                            Id = cs.User.Id,
                            Name = cs.User.FullName,
                            Email = cs.User.Email
                        },
                        Vehicle = new
                        {
                            Make = cs.Vehicle.Make,
                            Model = cs.Vehicle.Model,
                            PlateNumber = cs.Vehicle.PlateNumber
                        },
                        ChargingStation = new
                        {
                            Id = cs.ChargingStation.Id,
                            Location = cs.ChargingStation.Location
                        },
                        Invoice = new
                        {
                            Id = cs.Invoice.Id,
                            Amount = cs.Invoice.Amount
                        }
                    })
                    .ToListAsync();

                return Ok(sessions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching provider sessions", error = ex.Message });
            }
        }

        [HttpGet("stations")]
        public async Task<IActionResult> GetProviderStations()
        {
            try
            {
                var providerId = await GetCurrentProviderId();

                var stations = await _context.ChargingStations
                    .Include(cs => cs.Provider)
                    .Where(cs => cs.ProviderId == providerId)
                    .Select(cs => new
                    {
                        Id = cs.Id,
                        Location = cs.Location,
                        Latitude = cs.Latitude,
                        Longitude = cs.Longitude,
                        ProviderId = cs.ProviderId,
                        Status = "active", // You can add status field to ChargingStation model
                        Provider = new
                        {
                            Id = cs.Provider.Id,
                            Name = cs.Provider.Name,
                            PricePerMinute = cs.Provider.PricePerMinute
                        },
                        // Calculate earnings from sessions
                        TotalEarnings = _context.ChargingSessions
                            .Include(s => s.Invoice)
                            .Where(s => s.ChargingStationId == cs.Id)
                            .Sum(s => s.Invoice.Amount),
                        MonthlyEarnings = _context.ChargingSessions
                            .Include(s => s.Invoice)
                            .Where(s => s.ChargingStationId == cs.Id && 
                                       s.StartTime >= DateTime.UtcNow.AddDays(-30))
                            .Sum(s => s.Invoice.Amount),
                        TotalSessions = _context.ChargingSessions
                            .Count(s => s.ChargingStationId == cs.Id),
                        // ActiveConnectors = 0 // ❌ Kaldır
                    })
                    .OrderBy(cs => cs.Location)
                    .ToListAsync();

                return Ok(stations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching stations", error = ex.Message });
            }
        }

        [HttpPost("stations")]
        public async Task<IActionResult> CreateStation([FromBody] ProviderCreateStationDto dto)
        {
            try
            {
                var providerId = await GetCurrentProviderId();

                var station = new ChargingStation
                {
                    Location = dto.Location,
                    Latitude = dto.Latitude,
                    Longitude = dto.Longitude,
                    ProviderId = providerId
                    // ConnectorCount = dto.ConnectorCount // ❌ Kaldır
                };

                _context.ChargingStations.Add(station);
                await _context.SaveChangesAsync();

                var createdStation = await _context.ChargingStations
                    .Include(cs => cs.Provider)
                    .Where(cs => cs.Id == station.Id)
                    .Select(cs => new
                    {
                        Id = cs.Id,
                        Location = cs.Location,
                        Latitude = cs.Latitude,
                        Longitude = cs.Longitude,
                        ProviderId = cs.ProviderId,
                        Status = "active",
                        Provider = new
                        {
                            Id = cs.Provider.Id,
                            Name = cs.Provider.Name,
                            PricePerMinute = cs.Provider.PricePerMinute
                        },
                        TotalEarnings = 0.0,
                        MonthlyEarnings = 0.0,
                        TotalSessions = 0
                    })
                    .FirstOrDefaultAsync();

                return Ok(createdStation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating station", error = ex.Message });
            }
        }

        [HttpPut("stations/{id}")]
        public async Task<IActionResult> UpdateStation(int id, [FromBody] ProviderCreateStationDto dto)
        {
            try
            {
                var providerId = await GetCurrentProviderId();

                var station = await _context.ChargingStations
                    .FirstOrDefaultAsync(cs => cs.Id == id && cs.ProviderId == providerId);

                if (station == null)
                    return NotFound(new { message = "Station not found" });

                station.Location = dto.Location;
                station.Latitude = dto.Latitude;
                station.Longitude = dto.Longitude;
                // station.ConnectorCount = dto.ConnectorCount; // ❌ Kaldır

                await _context.SaveChangesAsync();

                var updatedStation = await _context.ChargingStations
                    .Include(cs => cs.Provider)
                    .Where(cs => cs.Id == station.Id)
                    .Select(cs => new
                    {
                        Id = cs.Id,
                        Location = cs.Location,
                        Latitude = cs.Latitude,
                        Longitude = cs.Longitude,
                        ProviderId = cs.ProviderId,
                        Status = "active",
                        Provider = new
                        {
                            Id = cs.Provider.Id,
                            Name = cs.Provider.Name,
                            PricePerMinute = cs.Provider.PricePerMinute
                        },
                        TotalEarnings = _context.ChargingSessions
                            .Include(s => s.Invoice)
                            .Where(s => s.ChargingStationId == cs.Id)
                            .Sum(s => s.Invoice.Amount),
                        MonthlyEarnings = _context.ChargingSessions
                            .Include(s => s.Invoice)
                            .Where(s => s.ChargingStationId == cs.Id && 
                                       s.StartTime >= DateTime.UtcNow.AddDays(-30))
                            .Sum(s => s.Invoice.Amount),
                        TotalSessions = _context.ChargingSessions
                            .Count(s => s.ChargingStationId == cs.Id)
                    })
                    .FirstOrDefaultAsync();

                return Ok(updatedStation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating station", error = ex.Message });
            }
        }

        [HttpDelete("stations/{id}")]
        public async Task<IActionResult> DeleteStation(int id)
        {
            try
            {
                var providerId = await GetCurrentProviderId();

                var station = await _context.ChargingStations
                    .FirstOrDefaultAsync(cs => cs.Id == id && cs.ProviderId == providerId);

                if (station == null)
                    return NotFound(new { message = "Station not found" });

                // Check if there are active sessions
                var activeSessions = await _context.ChargingSessions
                    .AnyAsync(cs => cs.ChargingStationId == id);

                if (activeSessions)
                    return BadRequest(new { message = "Cannot delete station with existing charging sessions" });

                _context.ChargingStations.Remove(station);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Station deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting station", error = ex.Message });
            }
        }

        // DTO class
        public class ProviderCreateStationDto
        {
            [Required]
            public string Location { get; set; } = string.Empty;
            
            [Required]
            public double Latitude { get; set; }
            
            [Required]
            public double Longitude { get; set; }
        }
    }
}