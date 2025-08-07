using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using server.Data;
using server.Models.DTOs.Auth;
using server.Models.Entities;
using server.Models.Enum;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // ✅ CORS Test Endpoint'i
        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok(new { 
                message = "Backend çalışıyor!", 
                timestamp = DateTime.UtcNow,
                cors = "OK"
            });
        }

        // ✅ Kullanıcıları listele
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _context.Users.Select(u => new { 
                    u.Id,
                    u.Email, 
                    u.FullName, 
                    Role = u.Role.ToString(),
                    RoleValue = (int)u.Role,
                    u.CreatedAt
                }).ToListAsync();
                
                return Ok(new {
                    message = "Tüm kullanıcılar",
                    count = users.Count(),
                    users = users
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kullanıcılar getirilemedi!", error = ex.Message });
            }
        }

        // ✅ Provider hesabı oluştur
        [HttpPost("create-provider")]
        public async Task<IActionResult> CreateProvider()
        {
            try
            {
                // Provider hesabı var mı kontrol et
                if (await _context.Users.AnyAsync(u => u.Email == "provider@test.com"))
                {
                    return BadRequest(new { message = "Provider hesabı zaten var!" });
                }
                
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword("123456");
                
                var provider = new User
                {
                    FullName = "Provider Test",
                    Email = "provider@test.com",
                    PasswordHash = hashedPassword,
                    Role = UserRole.Provider,
                    CreatedAt = DateTime.UtcNow
                };
                
                _context.Users.Add(provider);
                await _context.SaveChangesAsync();
                
                return Ok(new { 
                    message = "Provider hesabı oluşturuldu!",
                    user = new {
                        provider.Id,
                        provider.Email,
                        provider.FullName,
                        Role = provider.Role.ToString()
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Provider oluşturulamadı!", error = ex.Message });
            }
        }

        // ✅ OPTIONS Support
        [HttpOptions("login")]
        public IActionResult LoginOptions()
        {
            return Ok();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Email kontrolü
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "Email already exists" });
                }

                // Password confirmation kontrolü
                if (dto.Password != dto.ConfirmPassword)
                {
                    return BadRequest(new { message = "Passwords do not match" });
                }

                // FullName oluştur (FirstName + LastName)
                var fullName = $"{dto.FirstName.Trim()} {dto.LastName.Trim()}";

                // Yeni user oluştur - Sadece User rolü
                var user = new User
                {
                    FullName = fullName,
                    Email = dto.Email.ToLower().Trim(),
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Role = UserRole.User, // Sadece User rolü
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    message = "Registration successful", 
                    userId = user.Id,
                    fullName = user.FullName,
                    email = user.Email
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                // Kullanıcıyı bul
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

                if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                {
                    return Unauthorized(new { message = "Email veya şifre hatalı!" });
                }

                // Token oluştur
                var token = GenerateJwtToken(user);

                return Ok(new AuthResponseDto
                {
                    Token = token,
                    User = new UserDto
                    {
                        Id = user.Id,
                        FullName = user.FullName,
                        Email = user.Email,
                        Role = user.Role.ToString()
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Giriş sırasında hata oluştu!", error = ex.Message });
            }
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? ""));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpGet("test")]
        public async Task<IActionResult> Test()
        {
            try
            {
                var userCount = await _context.Users.CountAsync();
                var testUser = await _context.Users.FirstAsync();
                
                return Ok(new { 
                    message = "API çalışıyor!", 
                    userCount = userCount,
                    testUser = new { testUser.Email, testUser.FullName }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("test-login")]
        public async Task<IActionResult> TestLogin([FromBody] object data)
        {
            Console.WriteLine($"POST isteği geldi: {data}");
            return Ok(new { message = "POST isteği başarılı!", receivedData = data });
        }
    }
}
