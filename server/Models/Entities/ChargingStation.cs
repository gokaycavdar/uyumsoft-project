namespace server.Models.Entities
{
    public class ChargingStation
{
    public int Id { get; set; }
    public string Location { get; set; }
    public double Latitude { get; set; }  // ← Ekle
    public double Longitude { get; set; } // ← Ekle
    public int ProviderId { get; set; }

    // Navigation Properties
    public virtual Provider Provider { get; set; }
    public virtual ICollection<ChargingSession> ChargingSessions { get; set; } = new List<ChargingSession>();
    public virtual ICollection<UserComment> UserComments { get; set; } = new List<UserComment>();
}
}

