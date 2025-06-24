using AMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Repository.IRepository
{
    public interface IApplicationUserRepository : IRepository<ApplicationUser>
    {
        Task UpdateUserAsync(string userId, ApplicationUser user);
        Task<IEnumerable<ApplicationUser>> GetUserByHospitalIdAsync(Guid hospitalId);
        Task<ApplicationUser> GetHospitalAdminAsync(Guid hospitalId);
        Task<IEnumerable<ApplicationUser>> GetUsersByNameAsync(string name);
    }
}
