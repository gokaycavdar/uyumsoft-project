// server/Models/DTOs/ChargingSession/ChargingSessionDto.cs
using System.ComponentModel.DataAnnotations;

namespace server.Models.DTOs.ChargingSession // ✅ Klasöre göre namespace
{
    public class CreateChargingSessionDto
    {
        [Required]
        public int VehicleId { get; set; }

        [Required]
        public int ChargingStationId { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }
    }

    public class ChargingSessionResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int VehicleId { get; set; }
        public int ChargingStationId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int DurationMinutes { get; set; }
        public string VehicleInfo { get; set; } = string.Empty;
        public string StationLocation { get; set; } = string.Empty;
        public InvoiceResponseDto? Invoice { get; set; }
    }

    public class InvoiceResponseDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public int ChargingSessionId { get; set; }
    }
}