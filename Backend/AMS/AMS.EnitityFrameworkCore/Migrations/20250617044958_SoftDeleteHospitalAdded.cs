using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AMS.EnitityFrameworkCore.Migrations
{
    /// <inheritdoc />
    public partial class SoftDeleteHospitalAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_AspNetUsers_ApplicationUserId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_appointments_doctors_DoctorId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_appointments_hospitals_HospitalId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_categoryHospitals_categories_CategoryId",
                table: "categoryHospitals");

            migrationBuilder.DropForeignKey(
                name: "FK_categoryHospitals_hospitals_HospitalId",
                table: "categoryHospitals");

            migrationBuilder.DropForeignKey(
                name: "FK_doctorHospitals_doctors_DoctorId",
                table: "doctorHospitals");

            migrationBuilder.DropForeignKey(
                name: "FK_doctorHospitals_hospitals_HospitalId",
                table: "doctorHospitals");

            migrationBuilder.DropForeignKey(
                name: "FK_doctors_AspNetUsers_ApplicationUserId",
                table: "doctors");

            migrationBuilder.DropForeignKey(
                name: "FK_doctors_categories_CategoryId",
                table: "doctors");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_HospitalId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "hospitals",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_hospitals_AdminId",
                table: "hospitals",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_HospitalId",
                table: "AspNetUsers",
                column: "HospitalId");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_AspNetUsers_ApplicationUserId",
                table: "appointments",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_doctors_DoctorId",
                table: "appointments",
                column: "DoctorId",
                principalTable: "doctors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_hospitals_HospitalId",
                table: "appointments",
                column: "HospitalId",
                principalTable: "hospitals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_categoryHospitals_categories_CategoryId",
                table: "categoryHospitals",
                column: "CategoryId",
                principalTable: "categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_categoryHospitals_hospitals_HospitalId",
                table: "categoryHospitals",
                column: "HospitalId",
                principalTable: "hospitals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_doctorHospitals_doctors_DoctorId",
                table: "doctorHospitals",
                column: "DoctorId",
                principalTable: "doctors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_doctorHospitals_hospitals_HospitalId",
                table: "doctorHospitals",
                column: "HospitalId",
                principalTable: "hospitals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_doctors_AspNetUsers_ApplicationUserId",
                table: "doctors",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_doctors_categories_CategoryId",
                table: "doctors",
                column: "CategoryId",
                principalTable: "categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_hospitals_AspNetUsers_AdminId",
                table: "hospitals",
                column: "AdminId",
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

            migrationBuilder.DropForeignKey(
                name: "FK_appointments_doctors_DoctorId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_appointments_hospitals_HospitalId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_categoryHospitals_categories_CategoryId",
                table: "categoryHospitals");

            migrationBuilder.DropForeignKey(
                name: "FK_categoryHospitals_hospitals_HospitalId",
                table: "categoryHospitals");

            migrationBuilder.DropForeignKey(
                name: "FK_doctorHospitals_doctors_DoctorId",
                table: "doctorHospitals");

            migrationBuilder.DropForeignKey(
                name: "FK_doctorHospitals_hospitals_HospitalId",
                table: "doctorHospitals");

            migrationBuilder.DropForeignKey(
                name: "FK_doctors_AspNetUsers_ApplicationUserId",
                table: "doctors");

            migrationBuilder.DropForeignKey(
                name: "FK_doctors_categories_CategoryId",
                table: "doctors");

            migrationBuilder.DropForeignKey(
                name: "FK_hospitals_AspNetUsers_AdminId",
                table: "hospitals");

            migrationBuilder.DropIndex(
                name: "IX_hospitals_AdminId",
                table: "hospitals");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_HospitalId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "hospitals");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_HospitalId",
                table: "AspNetUsers",
                column: "HospitalId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_AspNetUsers_ApplicationUserId",
                table: "appointments",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_doctors_DoctorId",
                table: "appointments",
                column: "DoctorId",
                principalTable: "doctors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_hospitals_HospitalId",
                table: "appointments",
                column: "HospitalId",
                principalTable: "hospitals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_categoryHospitals_categories_CategoryId",
                table: "categoryHospitals",
                column: "CategoryId",
                principalTable: "categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_categoryHospitals_hospitals_HospitalId",
                table: "categoryHospitals",
                column: "HospitalId",
                principalTable: "hospitals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_doctorHospitals_doctors_DoctorId",
                table: "doctorHospitals",
                column: "DoctorId",
                principalTable: "doctors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_doctorHospitals_hospitals_HospitalId",
                table: "doctorHospitals",
                column: "HospitalId",
                principalTable: "hospitals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_doctors_AspNetUsers_ApplicationUserId",
                table: "doctors",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_doctors_categories_CategoryId",
                table: "doctors",
                column: "CategoryId",
                principalTable: "categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
