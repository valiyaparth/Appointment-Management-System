using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Shared.DTOs
{
    public class JwtResponseDto
    {
        public string Token { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
