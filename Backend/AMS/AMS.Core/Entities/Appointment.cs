using AMS.Core.Shared.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Entities
{
    public class Appointment
    {
        [Key]
        public Guid Id { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly TimeSlot { get; set; }
        public Status Status { get; set; }

        // Forign key

        [ForeignKey(nameof(ApplicationUser))]
        public string ApplicationUserId { get; set; }

        [ForeignKey(nameof(Doctor))]
        public Guid DoctorId { get; set; }

        [ForeignKey(nameof(Hospital))]
        public Guid HospitalId { get; set; }

        // Navigation property
        required public ApplicationUser ApplicationUser { get; set; }
        required public Doctor Doctor { get; set; }        
        required public Hospital Hospital { get; set; }
        public Review? Review { get; set; }

    }
}
