namespace server.Models.Entities
{
    public class FavoriteStation
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int ChargingStationId { get; set; }
        public ChargingStation ChargingStation { get; set; }
    }

}
