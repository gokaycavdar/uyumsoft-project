namespace server.Models.Entities
{
    public class Invoice
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Key
        public int ChargingSessionId { get; set; }

        // ✅ Navigation Property - Bu eksik olabilir
        public ChargingSession ChargingSession { get; set; } = null!;
    }
}
