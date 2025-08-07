// server/Models/DTOs/VehicleDto.cs
using System.ComponentModel.DataAnnotations;

namespace server.Models.DTOs
{
    public class CreateVehicleDto
    {
        [Required(ErrorMessage = "Make is required")]
        [StringLength(50, ErrorMessage = "Make cannot be longer than 50 characters")]
        public string Make { get; set; } = string.Empty;

        [Required(ErrorMessage = "Model is required")]
        [StringLength(50, ErrorMessage = "Model cannot be longer than 50 characters")]
        public string Model { get; set; } = string.Empty;

        [Required(ErrorMessage = "Plate number is required")]
        [StringLength(20, ErrorMessage = "Plate number cannot be longer than 20 characters")]
        public string PlateNumber { get; set; } = string.Empty;
    }

    public class UpdateVehicleDto
    {
        [Required(ErrorMessage = "Make is required")]
        [StringLength(50, ErrorMessage = "Make cannot be longer than 50 characters")]
        public string Make { get; set; } = string.Empty;

        [Required(ErrorMessage = "Model is required")]
        [StringLength(50, ErrorMessage = "Model cannot be longer than 50 characters")]
        public string Model { get; set; } = string.Empty;

        [Required(ErrorMessage = "Plate number is required")]
        [StringLength(20, ErrorMessage = "Plate number cannot be longer than 20 characters")]
        public string PlateNumber { get; set; } = string.Empty;
    }

    public class VehicleResponseDto
    {
        public int Id { get; set; }
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string PlateNumber { get; set; } = string.Empty;
        public int UserId { get; set; }
    }
}