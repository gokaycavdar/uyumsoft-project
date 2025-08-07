namespace server.Models.Entities
{
    public class ChargingSession
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        // Foreign Keys
        public int UserId { get; set; }
        public int VehicleId { get; set; }
        public int ChargingStationId { get; set; }

        // Navigation Properties
        public User User { get; set; } = null!;
        public Vehicle Vehicle { get; set; } = null!;
        public ChargingStation ChargingStation { get; set; } = null!;
        public Invoice? Invoice { get; set; }
    }
}
