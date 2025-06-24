using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Shared.DTOs
{
    public class DoctorDto
    {
        public Guid Id { get; set; }

        public string FullName { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string ImageUrl { get; set; }
        public int? Experience { get; set; }
        public string? Degree { get; set; }
        public string? Description { get; set; }
        public int AvgTimePerPatient { get; set; } = 20;
        public double? AvgRating { get; set; } = 0.0;

        public string ApplicationUserId { get; set; }
        public Guid CategoryId { get; set; }

        public List<AppointmentDto>? Appointments { get; set; }
        public List<Guid>? HospitalIds { get; set; }
        public CategoryDto Category { get; set; }
    }
}
