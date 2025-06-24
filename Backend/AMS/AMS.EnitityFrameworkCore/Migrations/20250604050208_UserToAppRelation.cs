using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AMS.EnitityFrameworkCore.Migrations
{
    /// <inheritdoc />
    public partial class UserToAppRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_AspNetUsers_ApplicationUserId",
                table: "appointments");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_AspNetUsers_ApplicationUserId",
                table: "appointments",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_AspNetUsers_ApplicationUserId",
                table: "appointments");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_AspNetUsers_ApplicationUserId",
                table: "appointments",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
