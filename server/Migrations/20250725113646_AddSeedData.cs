using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@energimetre.com", "Admin User", "$2a$11$UCCrFvmFSz88DFtwHc.nh.tcLqI5ZRk8qsfjxt1dndSIu0SUXBura", 1 },
                    { 2, new DateTime(2024, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc), "ahmet@test.com", "Ahmet Yılmaz", "$2a$11$C125mc7jJ/NsuC3Zwrt2mezvhCJkPYXuY76ZuXy8O1paOiNzZUwjG", 0 },
                    { 3, new DateTime(2024, 1, 3, 0, 0, 0, 0, DateTimeKind.Utc), "mehmet@test.com", "Mehmet Demir", "$2a$11$hJdPRmXiMMmq9K8QhkcSUeBAeOxkq.oz3OdLvFVVTkUTUW38ellyC", 2 },
                    { 4, new DateTime(2024, 1, 4, 0, 0, 0, 0, DateTimeKind.Utc), "zeynep@test.com", "Zeynep Kaya", "$2a$11$5Ui7AMlKT/Tj2SwL6QdbOuN9aSCJ7vnWdLye6J2OVnr3yHpE4rSbe", 0 }
                });

            migrationBuilder.InsertData(
                table: "AdminLogs",
                columns: new[] { "Id", "Action", "AdminId", "Timestamp" },
                values: new object[,]
                {
                    { 1, "Created provider: Türkiye Elektrik Şarj A.Ş.", 1, new DateTime(2024, 1, 3, 9, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, "Added charging station: Ankara Çankaya - Kızılay Metro Çıkışı", 1, new DateTime(2024, 1, 3, 9, 30, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Providers",
                columns: new[] { "Id", "ContactInfo", "Name", "PricePerMinute", "UserId" },
                values: new object[] { 1, "info@turkiyeelektrik.com | 0312 555 0123", "Türkiye Elektrik Şarj A.Ş.", 2.50m, 3 });

            migrationBuilder.InsertData(
                table: "Vehicles",
                columns: new[] { "Id", "Make", "Model", "PlateNumber", "UserId" },
                values: new object[,]
                {
                    { 1, "Tesla", "Model 3", "34 ABC 123", 2 },
                    { 2, "BMW", "iX3", "06 DEF 456", 4 }
                });

            migrationBuilder.InsertData(
                table: "ChargingStations",
                columns: new[] { "Id", "Location", "ProviderId" },
                values: new object[,]
                {
                    { 1, "Ankara Çankaya - Kızılay Metro Çıkışı", 1 },
                    { 2, "İstanbul Levent - Metro AVM Otoparkı", 1 },
                    { 3, "İzmir Konak - Alsancak Garı", 1 },
                    { 4, "Bursa Osmangazi - Şehir Hastanesi", 1 }
                });

            migrationBuilder.InsertData(
                table: "ChargingSessions",
                columns: new[] { "Id", "ChargingStationId", "EndTime", "StartTime", "UserId", "VehicleId" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2024, 1, 15, 15, 45, 0, 0, DateTimeKind.Utc), new DateTime(2024, 1, 15, 14, 30, 0, 0, DateTimeKind.Utc), 2, 1 },
                    { 2, 2, new DateTime(2024, 1, 16, 11, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 1, 16, 10, 15, 0, 0, DateTimeKind.Utc), 4, 2 }
                });

            migrationBuilder.InsertData(
                table: "FavoriteStations",
                columns: new[] { "Id", "ChargingStationId", "UserId" },
                values: new object[,]
                {
                    { 1, 1, 2 },
                    { 2, 2, 4 },
                    { 3, 3, 2 }
                });

            migrationBuilder.InsertData(
                table: "UserComments",
                columns: new[] { "Id", "ChargingStationId", "Comment", "CreatedAt", "UserId" },
                values: new object[,]
                {
                    { 1, 1, "Çok hızlı şarj oluyor, lokasyon mükemmel!", new DateTime(2024, 1, 15, 16, 0, 0, 0, DateTimeKind.Utc), 2 },
                    { 2, 2, "AVM'nin içinde olması çok pratik. Alışveriş yaparken şarj oluyor.", new DateTime(2024, 1, 16, 11, 30, 0, 0, DateTimeKind.Utc), 4 }
                });

            migrationBuilder.InsertData(
                table: "Invoices",
                columns: new[] { "Id", "Amount", "ChargingSessionId" },
                values: new object[,]
                {
                    { 1, 187.50m, 1 },
                    { 2, 112.50m, 2 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AdminLogs",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "AdminLogs",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "FavoriteStations",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "FavoriteStations",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "FavoriteStations",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Invoices",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "UserComments",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "UserComments",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ChargingSessions",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ChargingSessions",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Providers",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
