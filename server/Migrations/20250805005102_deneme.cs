using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class deneme : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@test.com", "Admin User", "$2a$11$gG/BhmbytkW5upHV0e.woehf3juy0X4NbXYDs5OOfv5HpMYg5ezdO", 1 },
                    { 2, new DateTime(2024, 1, 5, 0, 0, 0, 0, DateTimeKind.Utc), "user@test.com", "Test User", "$2a$11$OxSxEg2ZSXLRH3UL1gQBEOGcybiSBCeFCLDY4kvrJqe9iU9.J6qTy", 0 },
                    { 3, new DateTime(2024, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc), "ttenerji@provider.com", "Türk Telekom Enerji", "$2a$11$OOfJtdJQ.eN8yn1ZpAWNbeKd57eQC7mq.JZyEm2pP.1pIgNKNYDxG", 2 },
                    { 4, new DateTime(2024, 1, 3, 0, 0, 0, 0, DateTimeKind.Utc), "aksa@provider.com", "Aksa Enerji", "$2a$11$87HUT1Kj9iNkWEMgyFzXOOytkG7dQMgo/DfgWS8X1NVcLQE5SQA5C", 2 },
                    { 5, new DateTime(2024, 1, 4, 0, 0, 0, 0, DateTimeKind.Utc), "zorlu@provider.com", "Zorlu Enerji", "$2a$11$TKwXeDmTIoXoekmriWOqvu5DELwxn4ocuy/3qBFGx55EFxeiAyjka", 2 },
                    { 6, new DateTime(2024, 1, 5, 0, 0, 0, 0, DateTimeKind.Utc), "enerjisa@provider.com", "Enerjisa", "$2a$11$MCbsEnE/ajdvcAHOV/86tOghfcj03x6SpIbXyhnX2UrAhWUIHZJri", 2 },
                    { 7, new DateTime(2024, 1, 6, 0, 0, 0, 0, DateTimeKind.Utc), "shell@provider.com", "Shell Recharge", "$2a$11$mv4/yHrMcFbYLF80m0PIx.AEc6zzEgt16TsqhLe1Wf/rtVcoF3FK.", 2 },
                    { 8, new DateTime(2024, 1, 7, 0, 0, 0, 0, DateTimeKind.Utc), "po@provider.com", "Petrol Ofisi Charge", "$2a$11$iHHC.D8TAwrE5jDQz67pnOWfLk03C2vivh8pYl6pn.eIrOtJ5YcJK", 2 }
                });

            migrationBuilder.InsertData(
                table: "Providers",
                columns: new[] { "Id", "ContactInfo", "Name", "PricePerMinute", "UserId" },
                values: new object[,]
                {
                    { 1, "ttenerji@provider.com", "Türk Telekom Enerji", 2.50m, 3 },
                    { 2, "aksa@provider.com", "Aksa Enerji", 2.25m, 4 },
                    { 3, "zorlu@provider.com", "Zorlu Enerji", 2.75m, 5 },
                    { 4, "enerjisa@provider.com", "Enerjisa", 2.40m, 6 },
                    { 5, "shell@provider.com", "Shell Recharge", 3.00m, 7 },
                    { 6, "po@provider.com", "Petrol Ofisi Charge", 2.80m, 8 }
                });

            migrationBuilder.InsertData(
                table: "Vehicles",
                columns: new[] { "Id", "Make", "Model", "PlateNumber", "UserId" },
                values: new object[] { 1, "Tesla", "Model 3", "34 ABC 123", 2 });

            migrationBuilder.InsertData(
                table: "ChargingStations",
                columns: new[] { "Id", "Latitude", "Location", "Longitude", "ProviderId" },
                values: new object[,]
                {
                    { 1, 41.036900000000003, "İstanbul Taksim Meydanı", 28.984999999999999, 1 },
                    { 2, 40.990000000000002, "İstanbul Kadıköy İskelesi", 29.02, 1 },
                    { 3, 41.076599999999999, "İstanbul Levent Metro", 29.014199999999999, 2 },
                    { 4, 40.898600000000002, "İstanbul Sabiha Gökçen Havalimanı", 29.309699999999999, 5 },
                    { 5, 41.058100000000003, "İstanbul Şişli Cevahir AVM", 28.9833, 4 },
                    { 6, 41.0839, "İstanbul Fatih Sultan Mehmet Köprüsü", 29.037500000000001, 3 },
                    { 7, 39.9208, "Ankara Kızılay", 32.854100000000003, 1 },
                    { 8, 40.128100000000003, "Ankara Esenboğa Havalimanı", 32.995100000000001, 4 },
                    { 9, 39.909999999999997, "Ankara Tunalı Hilmi", 32.859999999999999, 2 },
                    { 10, 39.950000000000003, "Ankara Atatürk Orman Çiftliği", 32.883299999999998, 3 },
                    { 11, 38.418900000000001, "İzmir Konak Meydanı", 27.128699999999998, 2 },
                    { 12, 38.4392, "İzmir Alsancak Limanı", 27.137, 1 },
                    { 13, 38.292400000000001, "İzmir Adnan Menderes Havalimanı", 27.157, 5 },
                    { 14, 38.450000000000003, "İzmir Forum Bornova", 27.216699999999999, 1 },
                    { 15, 36.884099999999997, "Antalya Kaleiçi", 30.7056, 3 },
                    { 16, 40.188499999999998, "Bursa Ulus", 29.061, 4 },
                    { 17, 37.0, "Adana Merkez Park", 35.321300000000001, 1 },
                    { 18, 37.066200000000002, "Gaziantep Şahinbey", 37.383299999999998, 2 },
                    { 19, 37.866700000000002, "Konya Meram", 32.4833, 3 },
                    { 20, 39.776699999999998, "Eskişehir Odunpazarı", 30.520600000000002, 5 },
                    { 21, 41.0015, "Trabzon Ortahisar", 39.717799999999997, 6 },
                    { 22, 37.914400000000001, "Diyarbakır Sur", 40.230600000000003, 2 },
                    { 23, 41.286700000000003, "Samsun İlkadım", 36.329999999999998, 3 },
                    { 24, 37.776499999999999, "Denizli Pamukkale", 29.086400000000001, 4 }
                });

            migrationBuilder.InsertData(
                table: "FavoriteStations",
                columns: new[] { "Id", "ChargingStationId", "UserId" },
                values: new object[,]
                {
                    { 1, 1, 2 },
                    { 2, 7, 2 },
                    { 3, 11, 2 }
                });

            
            
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminLogs");

            migrationBuilder.DropTable(
                name: "FavoriteStations");

            migrationBuilder.DropTable(
                name: "Invoices");

            migrationBuilder.DropTable(
                name: "UserComments");

            migrationBuilder.DropTable(
                name: "ChargingSessions");

            migrationBuilder.DropTable(
                name: "ChargingStations");

            migrationBuilder.DropTable(
                name: "Vehicles");

            migrationBuilder.DropTable(
                name: "Providers");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
