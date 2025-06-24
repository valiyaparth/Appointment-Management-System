using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Entities
{
    public class Review
    {
        [Key]
        public Guid Id { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string? Comment { get; set; }

        public DateTime? Created { get; set; } = DateTime.UtcNow;

        // Foreign keys
        public Guid AppointmentId { get; set; }

        [ForeignKey(nameof(AppointmentId))]
        public Appointment Appointment { get; set; }

        public string ApplicationUserId { get; set; }

        [ForeignKey(nameof(ApplicationUserId))]
        public ApplicationUser ApplicationUser { get; set; }

        // Replies
        public Guid? DoctorReplyId { get; set; }
        public Reply? DoctorReply { get; set; }

        public Guid? HospitalReplyId { get; set; }
        public Reply? HospitalReply { get; set; }
    }
}
