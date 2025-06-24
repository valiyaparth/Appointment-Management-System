using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AMS.EnitityFrameworkCore.Migrations
{
    /// <inheritdoc />
    public partial class AddDbSets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_Doctor_DoctorId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_appointments_Hospital_HospitalId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_CategoryHospital_Category_CategoryId",
                table: "CategoryHospital");

            migrationBuilder.DropForeignKey(
                name: "FK_CategoryHospital_Hospital_HospitalId",
                table: "CategoryHospital");

            migrationBuilder.DropForeignKey(
                name: "FK_Doctor_AspNetUsers_ApplicationUserId",
                table: "Doctor");

            migrationBuilder.DropForeignKey(
                name: "FK_Doctor_Category_CategoryId",
                table: "Doctor");

            migrationBuilder.DropForeignKey(
                name: "FK_DoctorHospital_Doctor_DoctorId",
                table: "DoctorHospital");

            migrationBuilder.DropForeignKey(
                name: "FK_DoctorHospital_Hospital_HospitalId",
                table: "DoctorHospital");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Hospital",
                table: "Hospital");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DoctorHospital",
                table: "DoctorHospital");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Doctor",
                table: "Doctor");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CategoryHospital",
                table: "CategoryHospital");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Category",
                table: "Category");

            migrationBuilder.RenameTable(
                name: "Hospital",
                newName: "hospitals");

            migrationBuilder.RenameTable(
                name: "DoctorHospital",
                newName: "doctorHospitals");

            migrationBuilder.RenameTable(
                name: "Doctor",
                newName: "doctors");

            migrationBuilder.RenameTable(
                name: "CategoryHospital",
                newName: "categoryHospitals");

            migrationBuilder.RenameTable(
                name: "Category",
                newName: "categories");

            migrationBuilder.RenameIndex(
                name: "IX_DoctorHospital_HospitalId",
                table: "doctorHospitals",
                newName: "IX_doctorHospitals_HospitalId");

            migrationBuilder.RenameIndex(
                name: "IX_Doctor_CategoryId",
                table: "doctors",
                newName: "IX_doctors_CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Doctor_ApplicationUserId",
                table: "doctors",
                newName: "IX_doctors_ApplicationUserId");

            migrationBuilder.RenameIndex(
                name: "IX_CategoryHospital_HospitalId",
                table: "categoryHospitals",
                newName: "IX_categoryHospitals_HospitalId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_hospitals",
                table: "hospitals",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_doctorHospitals",
                table: "doctorHospitals",
                columns: new[] { "DoctorId", "HospitalId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_doctors",
                table: "doctors",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_categoryHospitals",
                table: "categoryHospitals",
                columns: new[] { "CategoryId", "HospitalId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_categories",
                table: "categories",
                column: "Id");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.DropPrimaryKey(
                name: "PK_hospitals",
                table: "hospitals");

            migrationBuilder.DropPrimaryKey(
                name: "PK_doctors",
                table: "doctors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_doctorHospitals",
                table: "doctorHospitals");

            migrationBuilder.DropPrimaryKey(
                name: "PK_categoryHospitals",
                table: "categoryHospitals");

            migrationBuilder.DropPrimaryKey(
                name: "PK_categories",
                table: "categories");

            migrationBuilder.RenameTable(
                name: "hospitals",
                newName: "Hospital");

            migrationBuilder.RenameTable(
                name: "doctors",
                newName: "Doctor");

            migrationBuilder.RenameTable(
                name: "doctorHospitals",
                newName: "DoctorHospital");

            migrationBuilder.RenameTable(
                name: "categoryHospitals",
                newName: "CategoryHospital");

            migrationBuilder.RenameTable(
                name: "categories",
                newName: "Category");

            migrationBuilder.RenameIndex(
                name: "IX_doctors_CategoryId",
                table: "Doctor",
                newName: "IX_Doctor_CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_doctors_ApplicationUserId",
                table: "Doctor",
                newName: "IX_Doctor_ApplicationUserId");

            migrationBuilder.RenameIndex(
                name: "IX_doctorHospitals_HospitalId",
                table: "DoctorHospital",
                newName: "IX_DoctorHospital_HospitalId");

            migrationBuilder.RenameIndex(
                name: "IX_categoryHospitals_HospitalId",
                table: "CategoryHospital",
                newName: "IX_CategoryHospital_HospitalId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Hospital",
                table: "Hospital",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Doctor",
                table: "Doctor",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DoctorHospital",
                table: "DoctorHospital",
                columns: new[] { "DoctorId", "HospitalId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_CategoryHospital",
                table: "CategoryHospital",
                columns: new[] { "CategoryId", "HospitalId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Category",
                table: "Category",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_Doctor_DoctorId",
                table: "appointments",
                column: "DoctorId",
                principalTable: "Doctor",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_Hospital_HospitalId",
                table: "appointments",
                column: "HospitalId",
                principalTable: "Hospital",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CategoryHospital_Category_CategoryId",
                table: "CategoryHospital",
                column: "CategoryId",
                principalTable: "Category",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CategoryHospital_Hospital_HospitalId",
                table: "CategoryHospital",
                column: "HospitalId",
                principalTable: "Hospital",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Doctor_AspNetUsers_ApplicationUserId",
                table: "Doctor",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Doctor_Category_CategoryId",
                table: "Doctor",
                column: "CategoryId",
                principalTable: "Category",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorHospital_Doctor_DoctorId",
                table: "DoctorHospital",
                column: "DoctorId",
                principalTable: "Doctor",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorHospital_Hospital_HospitalId",
                table: "DoctorHospital",
                column: "HospitalId",
                principalTable: "Hospital",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
