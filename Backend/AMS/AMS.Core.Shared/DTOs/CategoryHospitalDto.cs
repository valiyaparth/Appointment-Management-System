using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Shared.DTOs
{
    public class CategoryHospitalDto
    {
        public Guid CategoryId { get; set; }
        public Guid HospitalId { get; set; }
    }
}
