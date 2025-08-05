using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using server.Data;
using server.Models.Enum;
using server.Models.DTOs.Admin;
using server.Models.Entities;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                // Toplam kullanıcı sayısı (Admin hariç)
                var totalUsers = await _context.Users
                    .Where(u => u.Role == UserRole.User)
                    .CountAsync();

                // Toplam provider sayısı
                var totalProviders = await _context.Providers.CountAsync();

                // Aktif istasyon sayısı
                var activeStations = await _context.ChargingStations.CountAsync();

                var stats = new
                {
                    totalUsers = totalUsers,
                    totalProviders = totalProviders,
                    activeStations = activeStations
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching dashboard stats", error = ex.Message });
            }
        }

        // USER MANAGEMENT - Sadece Admin ve User
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _context.Users
                    .Where(u => u.Role == UserRole.User || u.Role == UserRole.Admin || u.Role == UserRole.Provider) // Provider eklendi
                    .Select(u => new
                    {
                        u.Id,
                        u.FullName,
                        u.Email,
                        Role = u.Role.ToString(),
                        u.CreatedAt
                    })
                    .OrderByDescending(u => u.CreatedAt)
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching users", error = ex.Message });
            }
        }

        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _context.Users
                    .Where(u => u.Id == id && (u.Role == UserRole.User || u.Role == UserRole.Admin || u.Role == UserRole.Provider)) // Provider eklendi
                    .Select(u => new
                    {
                        u.Id,
                        u.FullName,
                        u.Email,
                        Role = u.Role.ToString(),
                        u.CreatedAt
                    })
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching user", error = ex.Message });
            }
        }

        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Admin, User ve Provider rollerine izin ver
                if (dto.Role != "Admin" && dto.Role != "User" && dto.Role != "Provider")
                {
                    return BadRequest(new { message = "Only Admin, User and Provider roles are allowed" });
                }

                // Email kontrolü
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == dto.Email);

                if (existingUser != null)
                {
                    return BadRequest(new { message = "Email already exists" });
                }

                var user = new User
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Role = Enum.Parse<UserRole>(dto.Role),
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Log the action
                await LogAdminAction($"Created user: {user.FullName} ({user.Email}) with role {user.Role}");

                return CreatedAtAction(nameof(GetUserById),
                    new { id = user.Id },
                    new { message = "User created successfully", userId = user.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating user", error = ex.Message });
            }
        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = await _context.Users.FindAsync(id);
                if (user == null || (user.Role != UserRole.Admin && user.Role != UserRole.User && user.Role != UserRole.Provider))
                {
                    return NotFound(new { message = "User not found" });
                }

                // Admin, User ve Provider rollerine izin ver
                if (!string.IsNullOrEmpty(dto.Role) && dto.Role != "Admin" && dto.Role != "User" && dto.Role != "Provider")
                {
                    return BadRequest(new { message = "Only Admin, User and Provider roles are allowed" });
                }

                // Email kontrolü (kendisi hariç)
                if (!string.IsNullOrEmpty(dto.Email) && dto.Email != user.Email)
                {
                    var existingUser = await _context.Users
                        .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Id != id);

                    if (existingUser != null)
                    {
                        return BadRequest(new { message = "Email already exists" });
                    }
                    user.Email = dto.Email;
                }

                // Güncelleme
                if (!string.IsNullOrEmpty(dto.FullName))
                    user.FullName = dto.FullName;

                if (!string.IsNullOrEmpty(dto.Role))
                    user.Role = Enum.Parse<UserRole>(dto.Role);

                if (!string.IsNullOrEmpty(dto.Password))
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

                await _context.SaveChangesAsync();

                var oldValues = $"{user.FullName} ({user.Email}) - {user.Role}";
        
                // Log the action
                await LogAdminAction($"Updated user #{id}: {oldValues} -> {user.FullName} ({user.Email}) - {user.Role}");

                return Ok(new { message = "User updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating user", error = ex.Message });
            }
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null || (user.Role != UserRole.Admin && user.Role != UserRole.User && user.Role != UserRole.Provider))
                {
                    return NotFound(new { message = "User not found" });
                }

                if (user.Role == UserRole.Admin)
                {
                    return BadRequest(new { message = "Cannot delete admin users" });
                }

                // Provider rolündeki user silinmek isteniyorsa, önce provider entity'sini kontrol et
                if (user.Role == UserRole.Provider)
                {
                    var provider = await _context.Providers.FirstOrDefaultAsync(p => p.UserId == id);
                    if (provider != null)
                    {
                        return BadRequest(new { message = "Cannot delete user with active provider. Delete provider first." });
                    }
                }

                var userName = $"{user.FullName} ({user.Email})";
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                // Log the action
                await LogAdminAction($"Deleted user #{id}: {userName}");

                return Ok(new { message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting user", error = ex.Message });
            }
        }

        // PROVIDER MANAGEMENT - Ayrı yönetim
        [HttpGet("providers")]
        public async Task<IActionResult> GetAllProviders()
        {
            try
            {
                var providers = await _context.Providers
                    .Include(p => p.User)
                    .Select(p => new
                    {
                        id = p.Id,
                        name = p.Name,
                        contactInfo = p.ContactInfo,
                        pricePerMinute = p.PricePerMinute,
                        userId = p.UserId,
                        user = new
                        {
                            fullName = p.User.FullName,
                            email = p.User.Email
                        }
                    })
                    .ToListAsync();

                return Ok(providers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpGet("providers/{id}")]
        public async Task<IActionResult> GetProviderById(int id)
        {
            try
            {
                var provider = await _context.Providers
                    .Include(p => p.User)
                    .Where(p => p.Id == id)
                    .Select(p => new
                    {
                        id = p.Id,
                        name = p.Name,
                        contactInfo = p.ContactInfo,
                        pricePerMinute = p.PricePerMinute,
                        userId = p.UserId,
                        user = new
                        {
                            fullName = p.User.FullName,
                            email = p.User.Email
                        }
                    })
                    .FirstOrDefaultAsync();

                if (provider == null)
                {
                    return NotFound(new { message = "Provider not found" });
                }

                return Ok(provider);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpGet("provider-users")]
        public async Task<IActionResult> GetProviderUsers()
        {
            try
            {
                // Provider rolündeki kullanıcıları getir (henüz provider entity'si olmayanlar)
                var providerUsers = await _context.Users
                    .Where(u => u.Role == UserRole.Provider && !_context.Providers.Any(p => p.UserId == u.Id))
                    .Select(u => new
                    {
                        id = u.Id,
                        fullName = u.FullName,
                        email = u.Email,
                        role = u.Role.ToString()
                    })
                    .ToListAsync();

                return Ok(providerUsers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching provider users", error = ex.Message });
            }
        }

        [HttpPost("providers")]
        public async Task<IActionResult> CreateProvider([FromBody] CreateProviderDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // User'ın var olduğunu ve Provider rolünde olduğunu kontrol et
                var user = await _context.Users.FindAsync(dto.UserId);
                if (user == null)
                {
                    return BadRequest(new { message = "User not found" });
                }

                if (user.Role != UserRole.Provider)
                {
                    return BadRequest(new { message = "User must have Provider role" });
                }

                // Bu user'ın zaten bir provider'ı var mı kontrol et
                var existingProvider = await _context.Providers
                    .FirstOrDefaultAsync(p => p.UserId == dto.UserId);
                if (existingProvider != null)
                {
                    return BadRequest(new { message = "This user already has a provider" });
                }

                var provider = new Provider
                {
                    Name = dto.Name,
                    ContactInfo = dto.ContactInfo,
                    PricePerMinute = dto.PricePerMinute,
                    UserId = dto.UserId
                };

                _context.Providers.Add(provider);
                await _context.SaveChangesAsync();

                // Log the action
                await LogAdminAction($"Created provider: {provider.Name} (Contact: {provider.ContactInfo}, Price: ₺{provider.PricePerMinute}/min)");

                return CreatedAtAction(nameof(GetProviderById), new { id = provider.Id }, new
                {
                    id = provider.Id,
                    name = provider.Name,
                    contactInfo = provider.ContactInfo,
                    pricePerMinute = provider.PricePerMinute,
                    userId = provider.UserId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPut("providers/{id}")]
        public async Task<IActionResult> UpdateProvider(int id, [FromBody] UpdateProviderDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var provider = await _context.Providers.FindAsync(id);
                if (provider == null)
                {
                    return NotFound(new { message = "Provider not found" });
                }

                // User değiştiriliyorsa kontrol et
                if (dto.UserId.HasValue && dto.UserId != provider.UserId)
                {
                    var user = await _context.Users.FindAsync(dto.UserId.Value);
                    if (user == null)
                    {
                        return BadRequest(new { message = "User not found" });
                    }

                    if (user.Role != UserRole.Provider)
                    {
                        return BadRequest(new { message = "User must have Provider role" });
                    }

                    // Yeni user'ın zaten başka bir provider'ı var mı kontrol et
                    var existingProvider = await _context.Providers
                        .FirstOrDefaultAsync(p => p.UserId == dto.UserId.Value && p.Id != id);
                    if (existingProvider != null)
                    {
                        return BadRequest(new { message = "This user already has a provider" });
                    }

                    provider.UserId = dto.UserId.Value;
                }

                if (!string.IsNullOrEmpty(dto.Name))
                    provider.Name = dto.Name;

                if (!string.IsNullOrEmpty(dto.ContactInfo))
                    provider.ContactInfo = dto.ContactInfo;

                if (dto.PricePerMinute.HasValue)
                    provider.PricePerMinute = dto.PricePerMinute.Value;

                await _context.SaveChangesAsync();

                var oldValues = $"{provider.Name} (Contact: {provider.ContactInfo}, Price: ₺{provider.PricePerMinute}/min)";
        
                // Log the action
                await LogAdminAction($"Updated provider #{id}: {oldValues} -> {provider.Name} (Contact: {provider.ContactInfo}, Price: ₺{provider.PricePerMinute}/min)");

                return Ok(new { message = "Provider updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpDelete("providers/{id}")]
        public async Task<IActionResult> DeleteProvider(int id)
        {
            try
            {
                var provider = await _context.Providers
                    .Include(p => p.ChargingStations)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (provider == null)
                {
                    return NotFound(new { message = "Provider not found" });
                }

                // Provider'ın aktif istasyonları var mı kontrol et
                if (provider.ChargingStations.Any())
                {
                    return BadRequest(new { message = "Cannot delete provider with active charging stations" });
                }

                var providerName = provider.Name;
                _context.Providers.Remove(provider);
                await _context.SaveChangesAsync();

                // Log the action
                await LogAdminAction($"Deleted provider #{id}: {providerName}");

                return Ok(new { message = "Provider deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // STATION MANAGEMENT
        [HttpGet("stations")]
        public async Task<IActionResult> GetAllStations()
        {
            try
            {
                var stations = await _context.ChargingStations
                    .Include(s => s.Provider)
                    .ThenInclude(p => p.User)
                    .Select(s => new
                    {
                        s.Id,
                        s.Location,
                        s.Latitude,
                        s.Longitude,
                        s.ProviderId,
                        provider = new
                        {
                            name = s.Provider.Name,
                            pricePerMinute = s.Provider.PricePerMinute,
                            ownerName = s.Provider.User.FullName
                        }
                    })
                    .ToListAsync();

                return Ok(stations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching stations", error = ex.Message });
            }
        }

        [HttpGet("stations/{id}")]
        public async Task<IActionResult> GetStationById(int id)
        {
            try
            {
                var station = await _context.ChargingStations
                    .Include(s => s.Provider)
                    .ThenInclude(p => p.User)
                    .Where(s => s.Id == id)
                    .Select(s => new
                    {
                        s.Id,
                        s.Location,
                        s.Latitude,
                        s.Longitude,
                        s.ProviderId,
                        provider = new
                        {
                            name = s.Provider.Name,
                            pricePerMinute = s.Provider.PricePerMinute,
                            ownerName = s.Provider.User.FullName
                        }
                    })
                    .FirstOrDefaultAsync();

                if (station == null)
                {
                    return NotFound(new { message = "Station not found" });
                }

                return Ok(station);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching station", error = ex.Message });
            }
        }

        [HttpGet("providers-dropdown")]
        public async Task<IActionResult> GetProvidersForDropdown()
        {
            try
            {
                var providers = await _context.Providers
                    .Include(p => p.User)
                    .Select(p => new
                    {
                        id = p.Id,
                        name = p.Name,
                        ownerName = p.User.FullName,
                        pricePerMinute = p.PricePerMinute
                    })
                    .ToListAsync();

                return Ok(providers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching providers", error = ex.Message });
            }
        }

        [HttpPost("stations")]
        public async Task<IActionResult> CreateStation([FromBody] CreateStationDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Provider var mı kontrol et
                var providerExists = await _context.Providers.AnyAsync(p => p.Id == dto.ProviderId);
                if (!providerExists)
                {
                    return BadRequest(new { message = "Provider not found" });
                }

                var station = new ChargingStation
                {
                    Location = dto.Location,
                    Latitude = dto.Latitude,
                    Longitude = dto.Longitude,
                    ProviderId = dto.ProviderId
                };

                _context.ChargingStations.Add(station);
                await _context.SaveChangesAsync();

                // Log the action
                await LogAdminAction($"Created charging station: {station.Location} (Lat: {station.Latitude}, Lng: {station.Longitude})");

                return CreatedAtAction(nameof(GetStationById),
                    new { id = station.Id },
                    new { message = "Station created successfully", stationId = station.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating station", error = ex.Message });
            }
        }

        [HttpPut("stations/{id}")]
        public async Task<IActionResult> UpdateStation(int id, [FromBody] UpdateStationDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var station = await _context.ChargingStations.FindAsync(id);
                if (station == null)
                {
                    return NotFound(new { message = "Station not found" });
                }

                // Provider var mı kontrol et (değiştiriliyorsa)
                if (dto.ProviderId.HasValue && dto.ProviderId != station.ProviderId)
                {
                    var providerExists = await _context.Providers.AnyAsync(p => p.Id == dto.ProviderId);
                    if (!providerExists)
                    {
                        return BadRequest(new { message = "Provider not found" });
                    }
                    station.ProviderId = dto.ProviderId.Value;
                }

                // Güncelleme
                if (!string.IsNullOrEmpty(dto.Location))
                    station.Location = dto.Location;

                if (dto.Latitude.HasValue)
                    station.Latitude = dto.Latitude.Value;

                if (dto.Longitude.HasValue)
                    station.Longitude = dto.Longitude.Value;

                await _context.SaveChangesAsync();

                var oldValues = $"{station.Location} (Lat: {station.Latitude}, Lng: {station.Longitude})";
        
                // Log the action
                await LogAdminAction($"Updated charging station #{id}: {oldValues} -> {station.Location} (Lat: {station.Latitude}, Lng: {station.Longitude})");

                return Ok(new { message = "Station updated successfully" });
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
                var station = await _context.ChargingStations.FindAsync(id);
                if (station == null)
                {
                    return NotFound(new { message = "Station not found" });
                }

                var stationLocation = station.Location;
                _context.ChargingStations.Remove(station);
                await _context.SaveChangesAsync();

                // Log the action
                await LogAdminAction($"Deleted charging station #{id}: {stationLocation}");

                return Ok(new { message = "Station deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting station", error = ex.Message });
            }
        }

        // ADMIN LOGS
        [HttpGet("admin-logs")]
        public async Task<IActionResult> GetAdminLogs([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            try
            {
                var logs = await _context.AdminLogs
                    .OrderByDescending(l => l.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(l => new
                    {
                        id = l.Id,
                        action = l.Action,
                        createdAt = l.CreatedAt
                    })
                    .ToListAsync();

                var totalLogs = await _context.AdminLogs.CountAsync();

                return Ok(new
                {
                    logs = logs,
                    totalCount = totalLogs,
                    page = page,
                    pageSize = pageSize,
                    totalPages = (int)Math.Ceiling((double)totalLogs / pageSize)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching admin logs", error = ex.Message });
            }
        }

        [HttpDelete("admin-logs/{id}")]
        public async Task<IActionResult> DeleteAdminLog(int id)
        {
            try
            {
                var log = await _context.AdminLogs.FindAsync(id);
                if (log == null)
                {
                    return NotFound(new { message = "Admin log not found" });
                }

                _context.AdminLogs.Remove(log);
                await _context.SaveChangesAsync();

                // Log silme işlemini de logla
                await LogAdminAction($"Deleted admin log #{id}");

                return Ok(new { message = "Admin log deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting admin log", error = ex.Message });
            }
        }

        [HttpDelete("admin-logs/clear-all")]
        public async Task<IActionResult> ClearAllAdminLogs()
        {
            try
            {
                var logsCount = await _context.AdminLogs.CountAsync();
                _context.AdminLogs.RemoveRange(_context.AdminLogs);
                await _context.SaveChangesAsync();

                // Temizleme işlemini logla
                await LogAdminAction($"Cleared all admin logs ({logsCount} logs deleted)");

                return Ok(new { message = $"All admin logs cleared successfully ({logsCount} logs deleted)" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error clearing admin logs", error = ex.Message });
            }
        }

        // Helper method to log admin actions
        private async Task LogAdminAction(string action)
        {
            try
            {
                Console.WriteLine($"Attempting to log action: {action}");

                var adminLog = new AdminLog
                {
                    Action = action,
                    CreatedAt = DateTime.UtcNow
                };

                _context.AdminLogs.Add(adminLog);
                var result = await _context.SaveChangesAsync();
                Console.WriteLine($"Log saved successfully, affected rows: {result}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error logging admin action: {ex.Message}");
            }
        }

        [HttpPost("test-log")]
        public async Task<IActionResult> CreateTestLog()
        {
            try
            {
                await LogAdminAction("Test log created manually");
                return Ok(new { message = "Test log created" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating test log", error = ex.Message });
            }
        }

        // Get current user ID from JWT token
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 0;
        }
    }
}