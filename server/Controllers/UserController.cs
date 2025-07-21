using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Bu tüm endpoint'leri korur
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                // Token'dan kullanıcı bilgilerini al
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var role = User.FindFirst(ClaimTypes.Role)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                // TODO: Database'den kullanıcı bilgilerini çek
                return Ok(new
                {
                    Id = userId,
                    Email = email,
                    Role = role,
                    Message = "Profile data retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user profile");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("dashboard-data")]
        [Authorize(Roles = "user")] // Sadece user rolü
        public async Task<IActionResult> GetUserDashboardData()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            // Kullanıcıya özel dashboard verileri
            return Ok(new
            {
                CurrentUsage = "234 kWh",
                MonthlyBill = "₺156.80",
                ActiveProvider = "Not Selected",
                Message = $"Dashboard data for user {userId}"
            });
        }

        [HttpGet("admin-data")]
        [Authorize(Roles = "admin")] // Sadece admin rolü
        public async Task<IActionResult> GetAdminData()
        {
            return Ok(new
            {
                TotalUsers = 1234,
                ActiveProviders = 56,
                PendingApprovals = 8,
                TotalEnergy = "45,678 kWh"
            });
        }

        [HttpGet("provider-data")]
        [Authorize(Roles = "provider")] // Sadece provider rolü
        public async Task<IActionResult> GetProviderData()
        {
            return Ok(new
            {
                ActiveCustomers = 156,
                MonthlyRevenue = "₺24,560",
                EnergySupplied = "12,847 kWh",
                ServiceRating = "4.8/5"
            });
        }
    }
}
