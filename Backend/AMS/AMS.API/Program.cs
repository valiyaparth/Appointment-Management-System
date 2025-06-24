using AMS.Core.Entities;
using AMS.Core.Shared.Settings;
using Microsoft.AspNetCore.Identity;
using AMS.EnitityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using AMS.Repository.Data;
using Microsoft.EntityFrameworkCore;
using AMS.Core.Interfaces;
using AMS.Repository.Services;
using AMS.Repository.Repository.IRepository;
using AMS.Repository.Repository;
using Microsoft.OpenApi.Models;
using AMS.Core.Shared.Interfaces;
using AMS.API.Extensions;
var builder = WebApplication.CreateBuilder(args);


// Add Identity Roles
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
        .AddEntityFrameworkStores<AppointmentDbContext>()
    .AddDefaultTokenProviders();

//Add DbContext
builder.Services.AddDbContext<AppointmentDbContext>(optionts =>
    optionts.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


// Extension Methods

builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddSwaggerDocumentation();


builder.Services.AddControllers();

builder.Services.AddHttpContextAccessor();

//CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
        builder.WithOrigins("http://localhost:5173").AllowAnyMethod().AllowAnyHeader().AllowCredentials());
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwaggerDocumentation();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();


// Seeding Logic
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    await IdentitySeeder.AddSuperAdminAsync(services);
    await HospitalSeeder.SeedHospital(services);
    await CategorySeeder.SeedCategoryAsync(services);
    await DoctorSeeder.SeedDoctorAsync(services);
}

app.Run();
