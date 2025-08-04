// filepath: c:\Users\gokay\OneDrive\Masaüstü\Uyumsoft\UyumsoftProject\server\Data\ApplicationDbContext.cs
using Microsoft.EntityFrameworkCore;
using server.Models.Entities;
using server.Models.Enum;

namespace server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Provider> Providers { get; set; }
        public DbSet<ChargingStation> ChargingStations { get; set; }
        public DbSet<ChargingSession> ChargingSessions { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<FavoriteStation> FavoriteStations { get; set; }
        public DbSet<UserComment> UserComments { get; set; }
        public DbSet<AdminLog> AdminLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User unique email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
                
            // UserRole enum to int
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<int>();

            // Decimal precision (PostgreSQL için)
            modelBuilder.Entity<Provider>()
                .Property(p => p.PricePerMinute)
                .HasPrecision(10, 2);

            // AdminLog Configuration
            modelBuilder.Entity<AdminLog>()
                .HasOne(al => al.Admin)
                .WithMany()
                .HasForeignKey(al => al.AdminId)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ SEED DATA
            // Test Kullanıcıları
            modelBuilder.Entity<User>().HasData(
                new User 
                { 
                    Id = 1, 
                    FullName = "Admin User", 
                    Email = "admin@energimetre.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = UserRole.Admin,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User 
                { 
                    Id = 2, 
                    FullName = "Ahmet Yılmaz", 
                    Email = "ahmet@test.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    Role = UserRole.User,
                    CreatedAt = new DateTime(2024, 1, 2, 0, 0, 0, DateTimeKind.Utc)
                },
                new User 
                { 
                    Id = 3, 
                    FullName = "Mehmet Demir", 
                    Email = "mehmet@test.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    Role = UserRole.Provider,
                    CreatedAt = new DateTime(2024, 1, 3, 0, 0, 0, DateTimeKind.Utc)
                },
                new User 
                { 
                    Id = 4, 
                    FullName = "Zeynep Kaya", 
                    Email = "zeynep@test.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    Role = UserRole.User,
                    CreatedAt = new DateTime(2024, 1, 4, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // Test Araçları
            modelBuilder.Entity<Vehicle>().HasData(
                new Vehicle
                {
                    Id = 1,
                    Make = "Tesla",
                    Model = "Model 3",
                    PlateNumber = "34 ABC 123",
                    UserId = 2 // Ahmet'in aracı
                },
                new Vehicle
                {
                    Id = 2,
                    Make = "BMW",
                    Model = "iX3",
                    PlateNumber = "06 DEF 456",
                    UserId = 4 // Zeynep'in aracı
                }
            );

            // Test Provider'ı
            modelBuilder.Entity<Provider>().HasData(
                new Provider
                {
                    Id = 1,
                    Name = "Türkiye Elektrik Şarj A.Ş.",
                    ContactInfo = "info@turkiyeelektrik.com | 0312 555 0123",
                    PricePerMinute = 2.50m,
                    UserId = 3 // Mehmet'in provider'ı
                }
            );

            // Test Şarj İstasyonları
            modelBuilder.Entity<ChargingStation>().HasData(
                new ChargingStation
                {
                    Id = 1,
                    Location = "Ankara Çankaya - Kızılay Metro Çıkışı",
                    Latitude = 39.9208,
                    Longitude = 32.8541,
                    ProviderId = 1
                },
                new ChargingStation
                {
                    Id = 2,
                    Location = "İstanbul Levent - Metro AVM Otoparkı",
                    Latitude = 41.0766,
                    Longitude = 29.0124,
                    ProviderId = 1
                },
                new ChargingStation
                {
                    Id = 3,
                    Location = "İzmir Konak - Alsancak Garı",
                    Latitude = 38.4237,
                    Longitude = 27.1428,
                    ProviderId = 1
                },
                new ChargingStation
                {
                    Id = 4,
                    Location = "Bursa Osmangazi - Şehir Hastanesi",
                    Latitude = 40.1826,
                    Longitude = 29.0670,
                    ProviderId = 1
                },
                // Ankara'ya daha yakın istasyonlar ekle (map'te görmek için)
                new ChargingStation
                {
                    Id = 5,
                    Location = "Ankara Ümitköy - Metro İstasyonu",
                    Latitude = 39.8719,
                    Longitude = 32.8105,
                    ProviderId = 1
                },
                new ChargingStation
                {
                    Id = 6,
                    Location = "Ankara Çayyolu - Metro İstasyonu",
                    Latitude = 39.8547,
                    Longitude = 32.7319,
                    ProviderId = 1
                }
            );

            // Test Şarj Oturumları
            modelBuilder.Entity<ChargingSession>().HasData(
                new ChargingSession
                {
                    Id = 1,
                    UserId = 2, // Ahmet
                    VehicleId = 1, // Tesla Model 3
                    ChargingStationId = 1, // Kızılay
                    StartTime = new DateTime(2024, 1, 15, 14, 30, 0, DateTimeKind.Utc),
                    EndTime = new DateTime(2024, 1, 15, 15, 45, 0, DateTimeKind.Utc) // 75 dakika
                },
                new ChargingSession
                {
                    Id = 2,
                    UserId = 4, // Zeynep
                    VehicleId = 2, // BMW iX3
                    ChargingStationId = 2, // Levent
                    StartTime = new DateTime(2024, 1, 16, 10, 15, 0, DateTimeKind.Utc),
                    EndTime = new DateTime(2024, 1, 16, 11, 0, 0, DateTimeKind.Utc) // 45 dakika
                }
            );

            // Test Faturaları
            modelBuilder.Entity<Invoice>().HasData(
                new Invoice
                {
                    Id = 1,
                    ChargingSessionId = 1,
                    Amount = 187.50m // 75 dakika x 2.50 TL
                },
                new Invoice
                {
                    Id = 2,
                    ChargingSessionId = 2,
                    Amount = 112.50m // 45 dakika x 2.50 TL
                }
            );

            // Test Favori İstasyonları
            modelBuilder.Entity<FavoriteStation>().HasData(
                new FavoriteStation
                {
                    Id = 1,
                    UserId = 2, // Ahmet
                    ChargingStationId = 1 // Kızılay'ı favoriledi
                },
                new FavoriteStation
                {
                    Id = 2,
                    UserId = 4, // Zeynep
                    ChargingStationId = 2 // Levent'i favoriledi
                },
                new FavoriteStation
                {
                    Id = 3,
                    UserId = 2, // Ahmet
                    ChargingStationId = 3 // İzmir'i de favoriledi
                }
            );

            // Test Yorumları
            modelBuilder.Entity<UserComment>().HasData(
                new UserComment
                {
                    Id = 1,
                    UserId = 2, // Ahmet
                    ChargingStationId = 1, // Kızılay
                    Comment = "Çok hızlı şarj oluyor, lokasyon mükemmel!",
                    CreatedAt = new DateTime(2024, 1, 15, 16, 0, 0, DateTimeKind.Utc)
                },
                new UserComment
                {
                    Id = 2,
                    UserId = 4, // Zeynep
                    ChargingStationId = 2, // Levent
                    Comment = "AVM'nin içinde olması çok pratik. Alışveriş yaparken şarj oluyor.",
                    CreatedAt = new DateTime(2024, 1, 16, 11, 30, 0, DateTimeKind.Utc)
                }
            );

            // Test Admin Logları
            modelBuilder.Entity<AdminLog>().HasData(
                new AdminLog
                {
                    Id = 1,
                    AdminId = 1, // Admin User
                    Action = "Created provider: Türkiye Elektrik Şarj A.Ş.",
                    Timestamp = new DateTime(2024, 1, 3, 9, 0, 0, DateTimeKind.Utc)
                },
                new AdminLog
                {
                    Id = 2,
                    AdminId = 1, // Admin User
                    Action = "Added charging station: Ankara Çankaya - Kızılay Metro Çıkışı",
                    Timestamp = new DateTime(2024, 1, 3, 9, 30, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}