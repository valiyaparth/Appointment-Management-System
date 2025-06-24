using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AMS.EnitityFrameworkCore.Migrations
{
    /// <inheritdoc />
    public partial class RatingAddedToDoctor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "AvgRating",
                table: "doctors",
                type: "double precision",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvgRating",
                table: "doctors");
        }
    }
}
