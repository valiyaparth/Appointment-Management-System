using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Entities
{
    public class Hospital
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsActive { get; set; } = true;

        // Foreign Key
        public string AdminId { get; set; }

        //Navigation properties
        public ApplicationUser Admin { get; set; }
        public List<DoctorHospital> Doctors{ get; set; } = new List<DoctorHospital>();
        public List<CategoryHospital> Categories { get; set; } = new List<CategoryHospital>();
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}
