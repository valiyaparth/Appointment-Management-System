using AMS.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Shared.DTOs
{
    public class ReplyDto
    {
        public Guid ReviewId { get; set; }
        public string Message { get; set; }
        public ReplyType ReplyBy { get; set; }
    }
}
