namespace server.Models.Entities
{
    public class AdminLog
    {
        public int Id { get; set; }
        public int AdminId { get; set; } // User tablosundaki admin
        public virtual User Admin { get; set; } // virtual ekle
        public string Action { get; set; } // Örn: "Deleted vehicle #4"
        public DateTime Timestamp { get; set; } = DateTime.UtcNow; // Default value
    }

}
