namespace server.Models.Entities
{
    public class UserComment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ChargingStationId { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual User User { get; set; }
        public virtual ChargingStation ChargingStation { get; set; }
    }
}