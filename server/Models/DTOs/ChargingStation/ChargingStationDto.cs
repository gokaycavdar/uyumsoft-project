using System.ComponentModel.DataAnnotations; // ✅ Ekle

// Models/DTOs/ChargingStation/ChargingStationDto.cs
namespace server.Models.DTOs.ChargingStation
{
    public class ChargingStationDto
    {
        public int Id { get; set; }
        public string Location { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int ProviderId { get; set; }
        public string ProviderName { get; set; }
        public decimal Rate { get; set; }
    }

    public class ChargingStationCreateDto
    {
        [Required]
        [MaxLength(200)]
        public string Location { get; set; }
        
        [Required]
        [Range(-90, 90)]
        public double Latitude { get; set; }
        
        [Required]
        [Range(-180, 180)]
        public double Longitude { get; set; }
        
        [Required]
        public int ProviderId { get; set; }
    }

    public class ChargingStationUpdateDto
    {
        [MaxLength(200)]
        public string? Location { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }
}