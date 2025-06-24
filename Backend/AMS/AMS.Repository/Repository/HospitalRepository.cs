using AMS.Core.Entities;
using AMS.EnitityFrameworkCore;
using AMS.Repository.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Repository
{
    public class HospitalRepository : Repository<Hospital>, IHospitalRepository
    {
        private readonly AppointmentDbContext _context;

        public HospitalRepository(AppointmentDbContext context) : base(context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        // Get All Hospitals
        public async Task<IEnumerable<Hospital>> GetAllHospitalsAsync()
        {
            var hospitals = await _context.hospitals
                .Where(h => h.IsActive)
                .Include(h=>h.Doctors)
                    .ThenInclude(dh=>dh.Doctor)
                        .ThenInclude(d=>d.ApplicationUser)
                .Include(c=>c.Categories)
                    .ThenInclude(ch => ch.Category)
                .Include(a=>a.Appointments)
                    .ThenInclude(u=>u.ApplicationUser)
                .ToListAsync();

            if (hospitals is null || !hospitals.Any())
                return null;

            return hospitals;
        }


        // Get Hospital By Id
        public async Task<Hospital> GetHospitalByIdAsync(Guid id)
        {
            var hospital = await _context.hospitals
                .Where(h => h.IsActive)
                .Include(h => h.Doctors)
                    .ThenInclude(dh => dh.Doctor)
                        .ThenInclude(d => d.ApplicationUser)
                .Include(c => c.Categories)
                    .ThenInclude(ch => ch.Category)
                .Include(a => a.Appointments)
                    .ThenInclude(u => u.ApplicationUser)
                .FirstOrDefaultAsync(h=>h.Id == id);

            if (hospital is null)
                return null;

            return hospital;
        }


        // Get Hospitals By Category
        public async Task<IEnumerable<Hospital>> GetHospitalsByCategoryIdAsync(Guid categoryId)
        {
            var hospitals = await _context.hospitals
                .Where(h => h.IsActive)
               .Include(h => h.Doctors)
                   .ThenInclude(dh => dh.Doctor)
                       .ThenInclude(d => d.ApplicationUser)
               .Include(c => c.Categories)
                   .ThenInclude(ch => ch.Category)
               .Include(a => a.Appointments)
                   .ThenInclude(u => u.ApplicationUser)
               .Where(h => h.Categories.Any(c => c.CategoryId == categoryId))
               .ToListAsync();

            if (hospitals is null || !hospitals.Any())
                return null;

            return hospitals;
        }


        // Get Hospitals By DoctorId
        public async Task<IEnumerable<Hospital>> GetHospitalsByDoctorIdAsync(Guid? doctorId)
        {
            var hospitals = await _context.hospitals
                .Where(h => h.IsActive)
               .Include(h => h.Doctors)
                   .ThenInclude(dh => dh.Doctor)
                       .ThenInclude(d => d.ApplicationUser)
               .Include(c => c.Categories)
                   .ThenInclude(ch => ch.Category)
               .Include(a => a.Appointments)
                   .ThenInclude(u => u.ApplicationUser)
                .Where(h => h.Doctors.Any(d => d.DoctorId == doctorId))
                .ToListAsync();

            if (hospitals is null || !hospitals.Any())
                return null;

            return hospitals;
        }


        // Get Hospitals By Name
        public async Task<IEnumerable<Hospital>> GetHospitalsByNameAsync(string name)
        {
            var hospitals = await _context.hospitals
                .Where(h => h.IsActive)
                .Include(h => h.Doctors)
                   .ThenInclude(dh => dh.Doctor)
                       .ThenInclude(d => d.ApplicationUser)
               .Include(c => c.Categories)
                   .ThenInclude(ch => ch.Category)
               .Include(a => a.Appointments)
                   .ThenInclude(u => u.ApplicationUser)
                .Where(h => h.Name.ToLower().Contains(name.ToLower()))
                .ToListAsync();

            if (hospitals is null || !hospitals.Any())
                return null;

            return hospitals;
        }

        // Update Hospital
        public async Task UpdateHospitalAsync(Hospital hospital)
        {
            var existingHospital = await _context.hospitals
                .Include(h => h.Doctors)
                    .ThenInclude(dh => dh.Doctor)
                        .ThenInclude(d => d.ApplicationUser)
                .Include(c => c.Categories)
                    .ThenInclude(ch => ch.Category)
                .Include(a => a.Appointments)
                    .ThenInclude(u => u.ApplicationUser)
                .FirstOrDefaultAsync(h => h.Id == hospital.Id);

            if(existingHospital is null)
            {
                throw new KeyNotFoundException($"Hospital with HospitalId {hospital.Id} not found.");
            }

            existingHospital.Name = hospital.Name;
            existingHospital.Address = hospital.Address;
            existingHospital.PhoneNumber = hospital.PhoneNumber;
            existingHospital.Email = hospital.Email;

        }
    }
}
