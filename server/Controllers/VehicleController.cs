// server/Controllers/VehicleController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Entities;
using server.Models.DTOs;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VehicleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VehicleController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim);
        }

        [HttpGet]
        public async Task<IActionResult> GetUserVehicles()
        {
            try
            {
                var userId = GetCurrentUserId();
                
                var vehicles = await _context.Vehicles
                    .Where(v => v.UserId == userId)
                    .Select(v => new VehicleResponseDto
                    {
                        Id = v.Id,
                        Make = v.Make,
                        Model = v.Model,
                        PlateNumber = v.PlateNumber,
                        UserId = v.UserId
                    })
                    .ToListAsync();

                return Ok(vehicles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching vehicles", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromBody] CreateVehicleDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetCurrentUserId();

                // Check if plate number already exists for this user
                var existingVehicle = await _context.Vehicles
                    .FirstOrDefaultAsync(v => v.PlateNumber == dto.PlateNumber.Trim().ToUpper() && v.UserId == userId);

                if (existingVehicle != null)
                    return BadRequest(new { message = "Vehicle with this plate number already exists" });

                var vehicle = new Vehicle
                {
                    Make = dto.Make.Trim(),
                    Model = dto.Model.Trim(),
                    PlateNumber = dto.PlateNumber.Trim().ToUpper(),
                    UserId = userId
                };

                _context.Vehicles.Add(vehicle);
                await _context.SaveChangesAsync();

                var response = new VehicleResponseDto
                {
                    Id = vehicle.Id,
                    Make = vehicle.Make,
                    Model = vehicle.Model,
                    PlateNumber = vehicle.PlateNumber,
                    UserId = vehicle.UserId
                };

                return Ok(new { message = "Vehicle created successfully", vehicle = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating vehicle", error = ex.Message });
            }
        }

        // ✅ UPDATE Endpoint
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] UpdateVehicleDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetCurrentUserId();

                // Find the vehicle belonging to current user
                var vehicle = await _context.Vehicles
                    .FirstOrDefaultAsync(v => v.Id == id && v.UserId == userId);

                if (vehicle == null)
                    return NotFound(new { message = "Vehicle not found or you don't have permission to update it" });

                // Check if plate number already exists for this user (excluding current vehicle)
                var existingVehicle = await _context.Vehicles
                    .FirstOrDefaultAsync(v => v.PlateNumber == dto.PlateNumber.Trim().ToUpper() 
                                           && v.UserId == userId 
                                           && v.Id != id);

                if (existingVehicle != null)
                    return BadRequest(new { message = "Vehicle with this plate number already exists" });

                // Update vehicle properties
                vehicle.Make = dto.Make.Trim();
                vehicle.Model = dto.Model.Trim();
                vehicle.PlateNumber = dto.PlateNumber.Trim().ToUpper();

                await _context.SaveChangesAsync();

                var response = new VehicleResponseDto
                {
                    Id = vehicle.Id,
                    Make = vehicle.Make,
                    Model = vehicle.Model,
                    PlateNumber = vehicle.PlateNumber,
                    UserId = vehicle.UserId
                };

                return Ok(new { message = "Vehicle updated successfully", vehicle = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating vehicle", error = ex.Message });
            }
        }

        // ✅ DELETE Endpoint
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            try
            {
                var userId = GetCurrentUserId();

                // Find the vehicle belonging to current user
                var vehicle = await _context.Vehicles
                    .FirstOrDefaultAsync(v => v.Id == id && v.UserId == userId);

                if (vehicle == null)
                    return NotFound(new { message = "Vehicle not found or you don't have permission to delete it" });

                _context.Vehicles.Remove(vehicle);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Vehicle deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting vehicle", error = ex.Message });
            }
        }

        // ✅ GET Single Vehicle (Optional)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVehicle(int id)
        {
            try
            {
                var userId = GetCurrentUserId();

                var vehicle = await _context.Vehicles
                    .Where(v => v.Id == id && v.UserId == userId)
                    .Select(v => new VehicleResponseDto
                    {
                        Id = v.Id,
                        Make = v.Make,
                        Model = v.Model,
                        PlateNumber = v.PlateNumber,
                        UserId = v.UserId
                    })
                    .FirstOrDefaultAsync();

                if (vehicle == null)
                    return NotFound(new { message = "Vehicle not found" });

                return Ok(vehicle);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching vehicle", error = ex.Message });
            }
        }
    }
}