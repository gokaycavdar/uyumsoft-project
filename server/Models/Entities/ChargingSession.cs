namespace server.Models.Entities
{
    public class ChargingSession
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public int VehicleId { get; set; }
    public Vehicle Vehicle { get; set; }

    public int ChargingStationId { get; set; }
    public ChargingStation ChargingStation { get; set; }

    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public Invoice Invoice { get; set; }
}

}
