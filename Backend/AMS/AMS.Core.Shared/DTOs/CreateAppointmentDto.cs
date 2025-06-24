using AMS.Core.Shared.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Shared.DTOs
{
    public class CreateAppointmentDto
    {
            public DateOnly Date { get; set; }
            public TimeOnly TimeSlot { get; set; }
            public string ApplicationUserId { get; set; }
            public Guid DoctorId { get; set; }
            public Guid HospitalId { get; set; }
    }
}
