// Controllers/FavoriteStationController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Entities;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FavoriteStationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FavoriteStationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ Kullanıcının favori istasyonlarını getir
        [HttpGet]
        public async Task<IActionResult> GetUserFavorites()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

                var favorites = await _context.FavoriteStations
                    .Include(f => f.ChargingStation)
                    .ThenInclude(s => s.Provider)
                    .Where(f => f.UserId == userId)
                    .Select(f => new
                    {
                        f.Id,
                        f.ChargingStationId,
                        Station = new
                        {
                            f.ChargingStation.Id,
                            f.ChargingStation.Location,
                            f.ChargingStation.Latitude,
                            f.ChargingStation.Longitude,
                            f.ChargingStation.ProviderId,
                            ProviderName = f.ChargingStation.Provider.Name,
                            Rate = f.ChargingStation.Provider.PricePerMinute
                        }
                    })
                    .ToListAsync();

                return Ok(favorites);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching favorites", error = ex.Message });
            }
        }

        // ✅ Favori ekle
        [HttpPost("{stationId}")]
        public async Task<IActionResult> AddFavorite(int stationId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

                // Zaten favoride mi kontrol et
                var existingFavorite = await _context.FavoriteStations
                    .FirstOrDefaultAsync(f => f.UserId == userId && f.ChargingStationId == stationId);

                if (existingFavorite != null)
                {
                    return BadRequest(new { message = "Station already in favorites" });
                }

                // İstasyon var mı kontrol et
                var station = await _context.ChargingStations.FindAsync(stationId);
                if (station == null)
                {
                    return NotFound(new { message = "Charging station not found" });
                }

                // Favori ekle
                var favorite = new FavoriteStation
                {
                    UserId = userId,
                    ChargingStationId = stationId
                };

                _context.FavoriteStations.Add(favorite);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Station added to favorites", favoriteId = favorite.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error adding favorite", error = ex.Message });
            }
        }

        // ✅ Favori kaldır
        [HttpDelete("{stationId}")]
        public async Task<IActionResult> RemoveFavorite(int stationId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

                var favorite = await _context.FavoriteStations
                    .FirstOrDefaultAsync(f => f.UserId == userId && f.ChargingStationId == stationId);

                if (favorite == null)
                {
                    return NotFound(new { message = "Favorite not found" });
                }

                _context.FavoriteStations.Remove(favorite);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Station removed from favorites" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error removing favorite", error = ex.Message });
            }
        }

        // ✅ İstasyon favoride mi kontrol et
        [HttpGet("check/{stationId}")]
        public async Task<IActionResult> IsFavorite(int stationId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

                var isFavorite = await _context.FavoriteStations
                    .AnyAsync(f => f.UserId == userId && f.ChargingStationId == stationId);

                return Ok(new { isFavorite });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error checking favorite", error = ex.Message });
            }
        }
    }
}