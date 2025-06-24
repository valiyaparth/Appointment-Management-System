using AMS.Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Data
{
    public class IdentitySeeder
    {
        public static async Task AddSuperAdminAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            // Create All the roles
            string[] roles = { "SuperAdmin", "HospitalAdmin", "Doctor", "Patient" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            // Check if SuperAdmin exists
            var superAdminEmail = "superadmin@gmail.com";
            var superAdmin = await userManager.FindByEmailAsync(superAdminEmail);

            // Create SuperAdmin user
            if (superAdmin == null)
            {
                superAdmin = new ApplicationUser
                {
                    UserName = superAdminEmail,
                    Email = superAdminEmail,
                    FullName = "Super Admin",
                    EmailConfirmed = true,
                    DateOfBirth = new DateOnly(1998, 1, 1),
                    ImageUrl = "aoe83rh923rfb"
                };
                var result = await userManager.CreateAsync(superAdmin, "SuperAdmin@123");
                if (result.Succeeded)
                    // Assign SuperAdmin role
                    await userManager.AddToRoleAsync(superAdmin, "SuperAdmin");
            }
        }
    }
}
