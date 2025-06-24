using AMS.Core.Entities;
using AMS.Core.Shared.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Shared.DTOs
{
    public class GetAppointmentDto
    {
        public Guid Id { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly TimeSlot { get; set; }
        public Status Status { get; set; }

        public string ApplicationUserId { get; set; }
        public Guid DoctorId { get; set; }
        public Guid HospitalId { get; set; }

        public string ApplicationUserName { get; set; }
        public string DoctorName { get; set; }
        public HospitalDto Hospital { get; set; }
    }
}
