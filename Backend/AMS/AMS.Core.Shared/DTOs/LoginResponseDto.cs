using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Shared.DTOs
{
    public class LoginResponseDto
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public JwtResponseDto? Data { get; set; }
    }
}
