using server.Models.Enum;
using System.ComponentModel.DataAnnotations;

namespace server.Models.Entities
{
    public class Provider
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ContactInfo { get; set; }
        public decimal PricePerMinute { get; set; }

        public int UserId { get; set; } // FK
        public virtual User User { get; set; } // Navigation property

        public virtual ICollection<ChargingStation> ChargingStations { get; set; } = new List<ChargingStation>();
    }
}