using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AMS.Core.Shared.DTOs;

namespace AMS.Core.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginDto loginDto);
        Task<(bool Succeeded, string? Error)> RegisterAsync(RegisterDto registerDto);
        Task<(bool, string? email)> ConfirmEmailAsync(ConfirmEmailDto confirmEmailDto);
        Task<bool> SetPasswordAsync(SetPasswordDto setPasswordDto);
        Task<bool> ChangePasswordAsync(ChangePasswordDto changePasswordDto);
    }
}
