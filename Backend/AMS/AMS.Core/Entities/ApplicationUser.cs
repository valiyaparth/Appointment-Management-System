using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Entities
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        required public string FullName { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? ImageUrl { get; set; }


        // Foreign Key
        public Guid? HospitalId { get; set; } // nullable beacuse only hospitaladmin will have hospitalId
        public Guid? DoctorId { get; set; } // nullable because only doctor will have doctorId

        // Navigation properties
        [ForeignKey(nameof(HospitalId))]
        public Hospital? Hospital { get; set; }
        public Doctor? Doctor { get; set; }
        public ICollection<Appointment>? Appointments { get; set; }
    }
}
