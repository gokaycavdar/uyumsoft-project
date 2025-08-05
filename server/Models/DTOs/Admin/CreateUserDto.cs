using System.ComponentModel.DataAnnotations;

namespace server.Models.DTOs.Admin
{
    public class CreateUserDto
    {
        [Required(ErrorMessage = "Full name is required")]
        [StringLength(100, ErrorMessage = "Full name cannot exceed 100 characters")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Role is required")]
        [RegularExpression("^(Admin|User|Provider)$", ErrorMessage = "Role must be either Admin, User or Provider")]
        public string Role { get; set; }
    }

    public class UpdateUserDto
    {
        [MaxLength(100)]
        public string? FullName { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        [MinLength(6)]
        public string? Password { get; set; }

        public string? Role { get; set; }
    }
}