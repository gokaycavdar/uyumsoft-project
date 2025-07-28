using server.Models.Enum;
using System.ComponentModel.DataAnnotations;

namespace server.Models.Entities
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }
        
        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; }
        
        [Required]
        public string PasswordHash { get; set; }

        
        public UserRole Role { get; set; } = UserRole.User;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
        public virtual Provider? Provider { get; set; }
        public virtual ICollection<UserComment> UserComments { get; set; } = new List<UserComment>();
        // Diğerleri ihtiyaç duyulduğunda eklenebilir
    }
}