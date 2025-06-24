using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AMS.EnitityFrameworkCore.Migrations
{
    /// <inheritdoc />
    public partial class TimeSlotUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "appointments");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "appointments",
                newName: "TimeSlot");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TimeSlot",
                table: "appointments",
                newName: "StartTime");

            migrationBuilder.AddColumn<TimeOnly>(
                name: "EndTime",
                table: "appointments",
                type: "time without time zone",
                nullable: false,
                defaultValue: new TimeOnly(0, 0, 0));
        }
    }
}
