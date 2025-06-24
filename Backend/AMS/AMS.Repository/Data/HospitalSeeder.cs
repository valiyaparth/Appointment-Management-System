using AMS.Core.Entities;
using AMS.EnitityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace AMS.Repository.Data
{
    public class HospitalSeeder
    {
        public static async Task SeedHospital(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var context = serviceProvider.GetRequiredService<AppointmentDbContext>();

            if (!context.hospitals.Any())
            {

                Console.WriteLine("Creating Applicationuser for hospital");
                var hospitalAdmin = new ApplicationUser
                {
                    FullName = "City Hospital",
                    Email = "cityAdmin@gmail.com",
                    UserName = "cityAdmin@gmail.com",
                    PhoneNumber = "1234567890",
                    DateOfBirth = new DateOnly(1999, 12, 12)
                };

                var result = await userManager.CreateAsync(hospitalAdmin, "CityAdmin@123");

                Console.WriteLine("Created successfully");
                if (result.Succeeded)
                {
                    Console.WriteLine("Assining doctor role to user");
                    await userManager.AddToRoleAsync(hospitalAdmin, "HospitalAdmin");

                    var hospital = new Hospital
                    {
                        Id = Guid.Parse("178ca631-824a-4896-ae49-53bfe99a9e60"),
                        Email = "cityhospital@gmail.com",
                        Name = "City Hospital",
                        Address = "123 Main St, Cityville",
                        PhoneNumber = "123-456-7890",
                        AdminId = hospitalAdmin.Id,
                    };

                    // Add Hospital to DB
                    await context.hospitals.AddAsync(hospital);
                    await context.SaveChangesAsync();

                    // Assign Hospital Id to the Hospital Admin
                    hospitalAdmin.HospitalId = hospital.Id;
                    await userManager.UpdateAsync(hospitalAdmin);
                }
                else
                {
                    throw new ArgumentException("Failed to create hospital");
                }
                    
            }
        }
    }
}
