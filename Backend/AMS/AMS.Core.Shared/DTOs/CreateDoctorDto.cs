using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Shared.DTOs
{
    public class CreateDoctorDto
    {
            // ApplicationUser fields
            public string FullName { get; set; }
            public string Email { get; set; }
            public string PhoneNumber { get; set; }
            public DateOnly? DateOfBirth { get; set; }

            // Doctor-specific fields
            public int? Experience { get; set; }
            public string? Degree { get; set; }
            public string? Description { get; set; }
            public int AvgTimePerPatient { get; set; } = 20;
            
            // Foreign Keys
            public Guid CategoryId { get; set; }
            public Guid HospitalId { get; set; }
        
    }
}
