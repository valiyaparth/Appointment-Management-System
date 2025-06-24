using AMS.Core.Entities;
using AMS.EnitityFrameworkCore;
using AMS.Repository.Repository.IRepository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Repository
{
    public class ApplicationUserRepository : Repository<ApplicationUser>, IApplicationUserRepository
    {
        private readonly AppointmentDbContext _context;

        public ApplicationUserRepository(AppointmentDbContext context) : base(context)
        {
            _context = context;
        }

        // Get Users by Hospital ID
        public async Task<IEnumerable<ApplicationUser>> GetUserByHospitalIdAsync(Guid hospitalId)
        {
            var users = await _context.applicationUsers
                .Include(u => u.Appointments)
                .Where(u => u.Appointments.Any(a => a.HospitalId == hospitalId))
                .ToListAsync();

            if (users == null || !users.Any())
                return null;

            return users;
        }
        
        // Get Hospital Admin
        public async Task<ApplicationUser> GetHospitalAdminAsync(Guid hospitalId)
        {
            var user = await _context.applicationUsers
                .Include(u => u.Appointments)
                .FirstOrDefaultAsync(u => u.HospitalId == hospitalId);

            if (user == null)
                return null;

            return user;
        }


        //Get User by Name
        public async Task<IEnumerable<ApplicationUser>> GetUsersByNameAsync(string name)
        {
            var users = await _context.applicationUsers
                .Include(u => u.Appointments)
                .Where(c => c.FullName.ToLower().Contains(name.ToLower()))
                .ToListAsync();

            if (users == null || !users.Any())
                return null;

            return users;
        }

        // Update User
        public async Task UpdateUserAsync(string userId, ApplicationUser user)
        {
            var existingUser = await _context.applicationUsers
                 .FirstOrDefaultAsync(u => u.Id == userId);

            if (existingUser == null)
            {
                throw new Exception("User not found");
            }
            existingUser.FullName = user.FullName;
            existingUser.Email = user.Email;
            existingUser.PhoneNumber = user.PhoneNumber;
            existingUser.DateOfBirth = user.DateOfBirth;
            existingUser.ImageUrl = user.ImageUrl;
        }
    }
}
