using System.ComponentModel.DataAnnotations;
using server.Models.DTOs.ChargingStation;

// Models/DTOs/Favorite/FavoriteStationDto.cs
namespace server.Models.DTOs.Favorite
{
    public class FavoriteStationDto
    {
        public int Id { get; set; }
        public int ChargingStationId { get; set; }
        public ChargingStationDto Station { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AddFavoriteDto
    {
        [Required]
        public int ChargingStationId { get; set; }
    }

    public class FavoriteResponseDto
    {
        public string Message { get; set; }
        public int FavoriteId { get; set; }
    }
}