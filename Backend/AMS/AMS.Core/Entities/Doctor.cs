using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Entities
{
    public class Doctor
    {
        [Key]
        public Guid Id { get; set; }
        public int? Experience { get; set; } // in years
        public string? Degree { get; set; }
        public string? Description { get; set; }
        public int AvgTimePerPatient { get; set; } = 20;
        public double? AvgRating { get; set; }


        // Foreign key

        [ForeignKey(nameof(ApplicationUser))]
        required public string ApplicationUserId { get; set; }

        [ForeignKey(nameof(Category))]
        required public Guid CategoryId { get; set; }


        // Navigation properties
        public Category Category { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public ICollection<Appointment>? Appointments { get; set; }
        public List<DoctorHospital> Hospitals { get; set; } = new List<DoctorHospital>();
    }
}
