using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Entities
{
    public class DoctorHospital
    {
        [ForeignKey(nameof(Doctor))]
        public Guid DoctorId { get; set; }

        [ForeignKey(nameof(Hospital))]
        public Guid HospitalId { get; set; }

        // Navigation properties
        public Doctor Doctor { get; set; }
        public Hospital Hospital { get; set; }

        // Additional properties for scheduling
        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }

        public List<DayOfWeek>? Days { get; set; }
    }
}
