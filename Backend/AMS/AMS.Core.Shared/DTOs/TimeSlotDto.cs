using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Shared.DTOs
{
    public class TimeSlotDto
    {
        public TimeOnly StartTime { get; set; }
        public bool IsBooked { get; set; }
    }
}
