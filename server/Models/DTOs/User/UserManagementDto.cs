using System.ComponentModel.DataAnnotations; // ✅ Ekle

// Models/DTOs/User/UserManagementDto.cs
namespace server.Models.DTOs.User
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public int FavoriteCount { get; set; }
    }

    public class UpdateProfileDto
    {
        [MaxLength(100)]
        public string? FullName { get; set; }
        
        [EmailAddress]
        public string? Email { get; set; }
    }

    public class ChangePasswordDto
    {
        [Required]
        public string CurrentPassword { get; set; }
        
        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; }
    }
}