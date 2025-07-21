using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IConfiguration configuration, ILogger<AuthController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                // TODO: Database'den user doğrulaması yapılacak
                // Şimdilik hardcoded test users
                var testUsers = new[]
                {
                    new { Email = "admin@test.com", Password = "123456", Role = "admin", FirstName = "Admin", LastName = "User", Id = 1 },
                    new { Email = "provider@test.com", Password = "123456", Role = "provider", FirstName = "Provider", LastName = "User", Id = 2 },
                    new { Email = "user@test.com", Password = "123456", Role = "user", FirstName = "Test", LastName = "User", Id = 3 }
                };

                var user = testUsers.FirstOrDefault(u => u.Email == request.Email && u.Password == request.Password);
                
                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid credentials" });
                }

                // JWT Token oluştur
                var token = GenerateJwtToken(user.Id, user.Email, user.Role);

                return Ok(new LoginResponse
                {
                    Token = token,
                    User = new UserInfo
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Role = user.Role
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login error");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                // TODO: Database'e user kaydı yapılacak
                // TODO: Email validation
                // TODO: Password hashing

                // Şimdilik basit response
                _logger.LogInformation($"New user registration: {request.Email}");

                return Ok(new { message = "Registration successful. Please login." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration error");
                return StatusCode(500, new { message = "Registration failed" });
            }
        }

        private string GenerateJwtToken(int userId, string email, string role)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"] ?? "default-secret-key-for-development-only"));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "EnerjiMetre",
                audience: _configuration["Jwt:Audience"] ?? "EnerjiMetre",
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    // Request/Response Models
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Role { get; set; } = "user";
    }

    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public UserInfo User { get; set; } = new UserInfo();
    }

    public class UserInfo
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}
