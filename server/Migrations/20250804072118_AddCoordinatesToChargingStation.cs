using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddCoordinatesToChargingStation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "ChargingStations",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "ChargingStations",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "ChargingStations");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "ChargingStations");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$UCCrFvmFSz88DFtwHc.nh.tcLqI5ZRk8qsfjxt1dndSIu0SUXBura");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$C125mc7jJ/NsuC3Zwrt2mezvhCJkPYXuY76ZuXy8O1paOiNzZUwjG");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$hJdPRmXiMMmq9K8QhkcSUeBAeOxkq.oz3OdLvFVVTkUTUW38ellyC");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2a$11$5Ui7AMlKT/Tj2SwL6QdbOuN9aSCJ7vnWdLye6J2OVnr3yHpE4rSbe");
        }
    }
}
