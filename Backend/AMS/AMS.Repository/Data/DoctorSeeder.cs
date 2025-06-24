using AMS.Core.Entities;
using AMS.EnitityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Data
{
    public class DoctorSeeder
    {
        public static async Task SeedDoctorAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var context = serviceProvider.GetRequiredService<AppointmentDbContext>();
            if (!await context.doctors.AnyAsync())
            {
                // Check if doctor already exists
                Console.WriteLine("Checking for existed doctor");
                var existingUser = await userManager.FindByEmailAsync("vivek@gmail.com");
                if (existingUser == null)
                {
                    Console.WriteLine("Creating Applicationuser for doctor");
                    var user = new ApplicationUser
                    {
                        FullName = "Dr Vivek",
                        Email = "vivek@gmail.com",
                        UserName = "vivek@gmail.com",
                        PhoneNumber = "1234567890",
                        DateOfBirth = new DateOnly(2002, 4, 26)
                    };

                    var result = await userManager.CreateAsync(user, "Vivek@123");

                    Console.WriteLine("Created successfully");
                    if (result.Succeeded)
                    {
                        Console.WriteLine("Assining doctor role to user");
                        await userManager.AddToRoleAsync(user, "Doctor");

                        Console.WriteLine("Creating Doctor");
                        var doctor =new Doctor
                            {
                                Id = Guid.NewGuid(),
                                Experience = 10,
                                Degree = "MBBS, MD",
                                Description = "Experienced General Physician with a decade of practice in diagnosing and treating various medical conditions. " +
                                "Committed to providing comprehensive care and improving patient health outcomes.",
                                AvgTimePerPatient = 15,
                                ApplicationUserId = user.Id,
                                CategoryId = Guid.Parse("5ddbb28b-82cb-4ef6-8789-c35b156edcdb")
                            };

                        await context.doctors.AddAsync(doctor);

                        Console.WriteLine("Adding doctor to a hospital");
                        await context.doctorHospitals.AddRangeAsync(
                            new DoctorHospital
                            {
                                DoctorId = doctor.Id, // Assuming the first doctor is the one we just added
                                HospitalId = Guid.Parse("178ca631-824a-4896-ae49-53bfe99a9e60"),
                                StartTime = new TimeOnly(9, 0),
                                EndTime = new TimeOnly(12, 0),
                                Days = new List<DayOfWeek> { DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday }

                            }
                        );
                        await context.SaveChangesAsync();

                        // map doctorId to user table
                        user.DoctorId = doctor.Id;
                        await userManager.UpdateAsync(user);
                    }
                }
            }
        }
    }
}
