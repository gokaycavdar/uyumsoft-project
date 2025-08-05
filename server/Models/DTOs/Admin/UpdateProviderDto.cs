using System.ComponentModel.DataAnnotations;

namespace server.Models.DTOs.Admin
{
    public class UpdateProviderDto
    {
        [StringLength(100, ErrorMessage = "Provider name cannot exceed 100 characters")]
        public string? Name { get; set; }

        [StringLength(200, ErrorMessage = "Contact info cannot exceed 200 characters")]
        public string? ContactInfo { get; set; }

        [Range(0.01, 999.99, ErrorMessage = "Price per minute must be between 0.01 and 999.99")]
        public decimal? PricePerMinute { get; set; }

        public int? UserId { get; set; }
    }
}