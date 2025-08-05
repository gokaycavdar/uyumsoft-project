using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAdminId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdminLogs_Users_AdminId",
                table: "AdminLogs");

            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_AdminLogs_AdminId",
                table: "AdminLogs");

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 24);

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
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "ChargingStations",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Providers",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Providers",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Providers",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Providers",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Providers",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Providers",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DropColumn(
                name: "AdminId",
                table: "AdminLogs");

            migrationBuilder.AlterColumn<decimal>(
                name: "PricePerMinute",
                table: "Providers",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(10,2)",
                oldPrecision: 10,
                oldScale: 2);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "AdminLogs",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "NOW()",
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<string>(
                name: "Action",
                table: "AdminLogs",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "PricePerMinute",
                table: "Providers",
                type: "numeric(10,2)",
                precision: 10,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "AdminLogs",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValueSql: "NOW()");

            migrationBuilder.AlterColumn<string>(
                name: "Action",
                table: "AdminLogs",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500);

            migrationBuilder.AddColumn<int>(
                name: "AdminId",
                table: "AdminLogs",
                type: "integer",
                nullable: false,
                defaultValue: 0);

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

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AdminLogs_AdminId",
                table: "AdminLogs",
                column: "AdminId");

            migrationBuilder.AddForeignKey(
                name: "FK_AdminLogs_Users_AdminId",
                table: "AdminLogs",
                column: "AdminId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
