using System.ComponentModel.DataAnnotations;

namespace server.Models.DTOs.Admin
{
    public class CreateProviderDto
    {
        [Required(ErrorMessage = "Provider name is required")]
        [StringLength(100, ErrorMessage = "Provider name cannot exceed 100 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Contact info is required")]
        [StringLength(200, ErrorMessage = "Contact info cannot exceed 200 characters")]
        public string ContactInfo { get; set; }

        [Required(ErrorMessage = "Price per minute is required")]
        [Range(0.01, 999.99, ErrorMessage = "Price per minute must be between 0.01 and 999.99")]
        public decimal PricePerMinute { get; set; }

        [Required(ErrorMessage = "User ID is required")]
        public int UserId { get; set; }
    }
}