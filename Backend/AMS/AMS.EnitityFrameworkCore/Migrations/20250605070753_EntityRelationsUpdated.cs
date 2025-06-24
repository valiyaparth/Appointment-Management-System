using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AMS.EnitityFrameworkCore.Migrations
{
    /// <inheritdoc />
    public partial class EntityRelationsUpdated : Migration
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

            migrationBuilder.AddColumn<string>(
                name: "Degree",
                table: "doctors",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "doctors",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Experience",
                table: "doctors",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "AspNetUsers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

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

            migrationBuilder.DropColumn(
                name: "Degree",
                table: "doctors");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "doctors");

            migrationBuilder.DropColumn(
                name: "Experience",
                table: "doctors");

            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

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
        }
    }
}
