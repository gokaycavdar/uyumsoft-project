using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddCoordinatesToChargingStationWithSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Latitude", "Longitude" },
                values: new object[] { 39.9208, 32.854100000000003 });

            migrationBuilder.UpdateData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Latitude", "Longitude" },
                values: new object[] { 41.076599999999999, 29.0124 });

            migrationBuilder.UpdateData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Latitude", "Longitude" },
                values: new object[] { 38.423699999999997, 27.142800000000001 });

            migrationBuilder.UpdateData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Latitude", "Longitude" },
                values: new object[] { 40.182600000000001, 29.067 });

            migrationBuilder.InsertData(
                table: "ChargingStations",
                columns: new[] { "Id", "Latitude", "Location", "Longitude", "ProviderId" },
                values: new object[,]
                {
                    { 5, 39.871899999999997, "Ankara Ümitköy - Metro İstasyonu", 32.810499999999998, 1 },
                    { 6, 39.854700000000001, "Ankara Çayyolu - Metro İstasyonu", 32.731900000000003, 1 }
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$e2PZO9AiQRoMn.IQm/eRJu1p88YV6SDLK7Id6c2O9ZV7xbb5un6pG");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$Hvu6YgBCMWEekIhP0DmPa.Pj8s6LiL7338dZTAx0q3WTFfB5CBxV2");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$tTZnc.7Ldln5fhLeLhj6juxGf9GTzVyAXh3DfLn3XEYzuXC7z5M0y");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2a$11$tN3sBMxugRa8xJs7IDlVy.XOrGzfhexoDuE7E29Nysru1o1falXfi");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.UpdateData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Latitude", "Longitude" },
                values: new object[] { 0.0, 0.0 });

            migrationBuilder.UpdateData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Latitude", "Longitude" },
                values: new object[] { 0.0, 0.0 });

            migrationBuilder.UpdateData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Latitude", "Longitude" },
                values: new object[] { 0.0, 0.0 });

            migrationBuilder.UpdateData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Latitude", "Longitude" },
                values: new object[] { 0.0, 0.0 });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$fKA5Id6z4o6FSxafXAS9UOIw8GE8fQL1mflwc54ToxY/xZR.371om");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$vCbHsQLl8K0ViADDMo9DkeJRiKPvAVlQzV3FOFgZn1gwAfeLHMbMy");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$paucstNPhkFCpkGES5wYXeifjRXv5Eq/R7LqZwu.KoBlOis/7P87q");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2a$11$oBR8jdAuvUa6AQHMSeJ53.2Ki45cvS32er7HvJ4FJGOqb7kJD6jjC");
        }
    }
}
