using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Shared.DTOs
{
    public class DoctorHospitalDto
    {
        public Guid DoctorId { get; set; }
        public Guid HospitalId { get; set; }

        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }
        public List<DayOfWeek>? Days { get; set; }

        public DoctorDto? Doctor { get; set; }
        public CategoryDto? category { get; set; }
    }
}
