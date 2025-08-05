using System.ComponentModel.DataAnnotations;

namespace server.Models.DTOs.Admin
{
    public class CreateStationDto
    {
        [Required]
        [MaxLength(200)]
        public string Location { get; set; } = string.Empty;

        [Required]
        [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
        public double Latitude { get; set; }

        [Required]
        [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
        public double Longitude { get; set; }

        [Required]
        public int ProviderId { get; set; }
    }

    public class UpdateStationDto
    {
        [MaxLength(200)]
        public string? Location { get; set; }

        [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
        public double? Latitude { get; set; }

        [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
        public double? Longitude { get; set; }

        public int? ProviderId { get; set; }
    }
}