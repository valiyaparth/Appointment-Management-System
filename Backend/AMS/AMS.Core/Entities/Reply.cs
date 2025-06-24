using AMS.Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Entities
{
    public class Reply
    {
        [Key]
        public Guid Id { get; set; }

        [MaxLength(1000)]
        public string Message { get; set; }
        public DateTime RepliedAt { get; set; } = DateTime.UtcNow;
        public ReplyType ReplyBy { get; set; }
    }
}
