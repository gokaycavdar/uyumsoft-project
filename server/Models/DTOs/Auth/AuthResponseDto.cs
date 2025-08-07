using server.Models.DTOs.User;

namespace server.Models.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; }
        public UserDto User { get; set; }
    }
}