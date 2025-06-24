using AMS.Core.Entities;
using AMS.Core.Shared.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Shared.Interfaces
{
    public interface IApplicationUserService
    {
        Task<ApplicationUserDto> GetByIdAsync(string id);
        Task<IEnumerable<ApplicationUserDto>> GetUserByHospitalIdAsync(Guid hospitalId);
        Task<ApplicationUserDto> GetHospitalAdminAsync(Guid hospitalId);
        Task UpdateUserAsync(string userId, RegisterDto registerDto);
        Task<ApplicationUserDto> GetUserByEmailAsync(string email);
        Task<IEnumerable<ApplicationUserDto>> GetUsersByNameAsync(string name);
    }
}
