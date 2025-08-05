// Models/DTOs/Provider/ProviderDto.cs
using System.ComponentModel.DataAnnotations;

namespace server.Models.DTOs.Provider
{
    public class ProviderDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal PricePerMinute { get; set; }
        public string ContactEmail { get; set; }
        public int StationCount { get; set; }
    }

    public class ProviderCreateDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        
        [Required]
        [Range(0.01, 999.99)]
        public decimal PricePerMinute { get; set; }
        
        [Required]
        [EmailAddress]
        public string ContactEmail { get; set; }
    }
}