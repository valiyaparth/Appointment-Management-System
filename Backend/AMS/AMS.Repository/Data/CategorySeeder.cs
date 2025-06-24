using AMS.Core.Entities;
using AMS.EnitityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Data
{
    public class CategorySeeder
    {
        public static async Task SeedCategoryAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<AppointmentDbContext>();

            if (!await context.categories.AnyAsync())
            {
                await context.categories.AddRangeAsync(
                    
                    new Category { Id = Guid.NewGuid(), Name = "Allergists" },
                    new Category { Id = Guid.NewGuid(), Name = "Anesthesiologists" },
                    new Category { Id = Guid.NewGuid(), Name = "Cardiologists" },
                    new Category { Id = Guid.NewGuid(), Name = "Colon and Rectal Surgeons" },
                    new Category { Id = Guid.NewGuid(), Name = "Critical Care Medicine Specialists" },
                    new Category { Id = Guid.NewGuid(), Name = "Dermatologists" },
                    new Category { Id = Guid.NewGuid(), Name = "Endocrinologists" },
                    new Category { Id = Guid.NewGuid(), Name = "Emergency Medicine Specialists" },
                    new Category { Id = Guid.NewGuid(), Name = "Family Physicians" },
                    new Category { Id = Guid.NewGuid(), Name = "Gastroenterologists" },
                    new Category { Id = Guid.NewGuid(), Name = "Geriatric Medicine Specialists" },
                    new Category { Id = Guid.NewGuid(), Name = "Hematologists" },
                    new Category { Id = Guid.NewGuid(), Name = "Hospice and Palliative Medicine Specialists" },
                    new Category { Id = Guid.NewGuid(), Name = "Infectious Disease Specialists" },
                    new Category { Id = Guid.NewGuid(), Name = "Internists" },
                    new Category { Id = Guid.NewGuid(), Name = "Medical Geneticists" },
                    new Category { Id = Guid.NewGuid(), Name = "Nephrologists" },
                    new Category { Id = Guid.NewGuid(), Name = "Neurologists" },
                    new Category { Id = Guid.NewGuid(), Name = "Gynecologists" },
                    new Category { Id = Guid.NewGuid(), Name = "Oncologists" },
                    new Category { Id = Guid.NewGuid(), Name = "Ophthalmologists" },
                    new Category { Id = Guid.NewGuid(), Name = "Osteopaths " },
                    new Category { Id = Guid.NewGuid(), Name = "Otolaryngologists" },
                    new Category { Id = Guid.NewGuid(), Name = "Pathologists" },
                    new Category { Id = Guid.NewGuid(), Name = "Pediatricians" },
                    new Category { Id = Guid.NewGuid(), Name = "Physiatrists" },
                    new Category { Id = Guid.NewGuid(), Name = "Plastic Surgeons" },
                    new Category { Id = Guid.NewGuid(), Name = "Podiatrists" },
                    new Category { Id = Guid.NewGuid(), Name = "Preventive Medicine Specialists" },
                    new Category { Id = Guid.NewGuid(), Name = "Psychiatrists" },
                    new Category { Id = Guid.NewGuid(), Name = "Pulmonologists" },
                    new Category { Id = Guid.NewGuid(), Name = "Radiologists" },
                    new Category { Id = Guid.NewGuid(), Name = "Rheumatologists" },
                    new Category { Id = Guid.NewGuid(), Name = "Sleep Medicine Specialists" },
                    new Category { Id = Guid.NewGuid(), Name = "Sports Medicine Specialists" },
                    new Category { Id = Guid.NewGuid(), Name = "General Surgeons" },
                    new Category { Id = Guid.NewGuid(), Name = "Urologists" },
                    new Category { Id = Guid.Parse("5ddbb28b-82cb-4ef6-8789-c35b156edcdb"), Name = "Test"}
                    );

                await context.SaveChangesAsync();
            }
        }
    }
}
