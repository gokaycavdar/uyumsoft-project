// Controllers/ChargingStationController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Entities;

namespace server.Controllers
{
    [ApiController]
    [Route("api/chargingstation")]
    public class ChargingStationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // ✅ Constructor ekle
        public ChargingStationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        //[Authorize]
        public async Task<IActionResult> GetAllStations()
        {
            try
            {
                var stations = await _context.ChargingStations
                    .Include(s => s.Provider)
                    .Select(s => new
                    {
                        s.Id,
                        s.Location,
                        s.Latitude,
                        s.Longitude,
                        s.ProviderId,
                        ProviderName = s.Provider.Name,
                        // ✅ Rate provider'dan gelsin
                        Rate = s.Provider.PricePerMinute,
                        // ✅ Gereksiz field'ları kaldır
                        // Status, ConnectorCount, AvailableConnectors kaldırıldı
                    })
                    .ToListAsync();

                return Ok(stations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching stations", error = ex.Message });
            }
        }

        [HttpGet("test-no-auth")]
        public IActionResult TestNoAuth()
        {
            try
            {
                var stationCount = _context.ChargingStations.Count();
                return Ok(new { 
                    message = "API çalışıyor - Auth yok!", 
                    stationCount = stationCount,
                    timestamp = DateTime.Now 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}