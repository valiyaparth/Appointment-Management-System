using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Shared.DTOs
{
    public class ReviewDto
    {
        public Guid Id { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }

        public string UserFullName { get; set; }
        public string? DoctorName { get; set; }
        public string? DoctorReply { get; set; }

        public string? HospitalName { get; set; }
        public string? HospitalReply { get; set; }
    }
}
