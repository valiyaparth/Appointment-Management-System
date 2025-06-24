using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Shared.DTOs
{
    public class ApplicationUserDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string? ImageUrl { get; set; }

        // Foreign Key
        public Guid? HospitalId { get; set; }
        public Guid? DoctorId { get; set; }
    }
}
