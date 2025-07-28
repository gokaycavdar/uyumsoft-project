namespace server.Models.Entities
{
    public class Invoice
    {
        public int Id { get; set; }

        public int ChargingSessionId { get; set; }
        public ChargingSession ChargingSession { get; set; }

        public decimal Amount { get; set; }
    }

}
