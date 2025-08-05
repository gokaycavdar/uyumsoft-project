namespace server.Models.Entities
{
    public class AdminLog
    {
        public int Id { get; set; }
        
        public string Action { get; set; } // Örn: "Deleted vehicle #4"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Default value
    }

}
