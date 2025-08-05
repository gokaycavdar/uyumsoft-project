// filepath: c:\Users\gokay\OneDrive\Masaüstü\Uyumsoft\UyumsoftProject\server\Data\ApplicationDbContext.cs
using Microsoft.EntityFrameworkCore;
using server.Models.Entities;

namespace server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Provider> Providers { get; set; }
        public DbSet<ChargingStation> ChargingStations { get; set; }
        public DbSet<ChargingSession> ChargingSessions { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<FavoriteStation> FavoriteStations { get; set; }
        public DbSet<UserComment> UserComments { get; set; }
        public DbSet<AdminLog> AdminLogs { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // AdminLog configuration - PostgreSQL için düzeltildi
            modelBuilder.Entity<AdminLog>(entity =>
            {
                entity.HasKey(al => al.Id);
                entity.Property(al => al.Action).IsRequired().HasMaxLength(500);
                entity.Property(al => al.CreatedAt).HasDefaultValueSql("NOW()"); // PostgreSQL için NOW()
            });

            // Diğer entity konfigürasyonları buraya eklenebilir
        }
    }
}