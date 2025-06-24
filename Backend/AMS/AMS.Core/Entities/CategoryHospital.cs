using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Entities
{
    public class CategoryHospital
    {
        [ForeignKey(nameof(Category))]
        public Guid CategoryId { get; set; }

        [ForeignKey(nameof(Hospital))]
        public Guid HospitalId { get; set; }

        // Navigation properties
        public Category Category { get; set; }
        public Hospital Hospital { get; set; }
    }
}
