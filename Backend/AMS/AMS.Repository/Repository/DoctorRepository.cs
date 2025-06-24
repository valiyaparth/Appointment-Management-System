using AMS.Core.Entities;
using AMS.EnitityFrameworkCore;
using AMS.Repository.Repository.IRepository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Repository
{
    public class DoctorRepository : Repository<Doctor>, IDoctorRepository
    {
        private readonly AppointmentDbContext _context;

        public DoctorRepository(AppointmentDbContext context) : base(context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }


        // Get All Doctors
        public async Task<IEnumerable<Doctor>> GetAllDoctorsAsync()
        {
            var doctors = await _context.doctors
                .Where(d => d.Hospitals.Any() && d.ApplicationUser.EmailConfirmed)
                .Include(d => d.Category)
                .Include(d => d.ApplicationUser)
                .Include(d => d.Appointments)
                .Include(d => d.Hospitals)
                    .ThenInclude(dh => dh.Hospital)
                .ToListAsync();

            if (!doctors.Any())
                return null;

            return doctors;
        }


        // Get Doctor by Id
        public async Task<Doctor> GetDoctorByIdAsync(Guid doctorId)
        {
            var doctor = await _context.doctors
                .Where(d => d.Hospitals.Any() && d.ApplicationUser.EmailConfirmed)
                .Include(d => d.Category)
                .Include(d => d.ApplicationUser)
                .Include(d => d.Appointments)
                .Include(d => d.Hospitals)
                    .ThenInclude(dh => dh.Hospital)
                .FirstOrDefaultAsync(d => d.Id == doctorId);

            if (doctor is null)
                return null;

            return doctor;
        }


        // Get Doctors by Category Id
        public async Task<IEnumerable<Doctor>> GetDoctorsByCategoryAsync(Guid categoryId)
        {
            var doctors = await _context.doctors
                .Where(d => d.Hospitals.Any() && d.ApplicationUser.EmailConfirmed)
                .Include(d => d.Category)
                .Include(d => d.ApplicationUser)
                .Include(d => d.Appointments)
                .Include(d => d.Hospitals)
                    .ThenInclude(dh => dh.Hospital)
                .Where(d => d.CategoryId == categoryId)
                .ToListAsync();

            if (doctors is null || !doctors.Any())
                return null;

            return doctors;

        }


        // Get Doctors by Hospital Id
        public async Task<IEnumerable<Doctor>> GetDoctorsByHospitalIdAsync(Guid hospitalId)
        {
            var doctors = await _context.doctors
               .Where(d => d.Hospitals.Any() && d.ApplicationUser.EmailConfirmed)
               .Include(d => d.Category)
               .Include(d => d.ApplicationUser)
               .Include(d => d.Appointments)
               .Include(d => d.Hospitals)
                   .ThenInclude(dh => dh.Hospital)
                .Where(d => d.Hospitals.Any(h => h.HospitalId == hospitalId))
                .ToListAsync();

            if (doctors is null || !doctors.Any())
                return null;

            return doctors;
        }


        // Get Doctors by Name
        public async Task<IEnumerable<Doctor>> GetDoctorsByNameAsync(string name)
        {
            var doctors = await _context.doctors
               .Where(d => d.Hospitals.Any() && d.ApplicationUser.EmailConfirmed)
               .Include(d => d.Category)
               .Include(d => d.ApplicationUser)
               .Include(d => d.Appointments)
               .Include(d => d.Hospitals)
                   .ThenInclude(dh => dh.Hospital)
               .Where(d => d.ApplicationUser.FullName.ToLower().Contains(name.ToLower()))
               .ToListAsync();

            if (doctors is null || !doctors.Any())
                return null;

            return doctors;
        }

        // Add Doctor to Hospital
        public async Task AddDoctorToHospitalAsync(DoctorHospital doctorHospital)
        {
            await _context.doctorHospitals.AddAsync(doctorHospital);
        }

        // Update Doctor
        public async Task UpdateDoctorAsync(Doctor doctor)
        {
            var existingDoctor = await _context.doctors
                .Where(d => d.Hospitals.Any() && d.ApplicationUser.EmailConfirmed)
                .Include(d => d.Category)
                .Include(d => d.ApplicationUser)
                .Include(d => d.Appointments)
                .Include(d => d.Hospitals)
                    .ThenInclude(dh => dh.Hospital)
                .FirstOrDefaultAsync(d => d.Id == doctor.Id);

            if (existingDoctor is null)
            {
                throw new KeyNotFoundException($"Doctor with DoctorId {doctor.Id} not found");
            }

            existingDoctor.Experience = doctor.Experience;
            existingDoctor.Degree = doctor.Degree;
            existingDoctor.Description = doctor.Description;
            existingDoctor.AvgTimePerPatient = doctor.AvgTimePerPatient;
        }

        // Get Doctor Schedule by Hospital Id
        public async Task<IEnumerable<DoctorHospital>> GetDoctorScheduleAsync(Guid hospitalId)
        {
            var doctorHospitals = await _context.doctorHospitals
                .Where(dh => dh.HospitalId == hospitalId)
                .Include(dh => dh.Doctor)
                    .ThenInclude(d => d.ApplicationUser)
                .Include(dh => dh.Doctor)
                    .ThenInclude(d => d.Category)
                .ToListAsync();
            if (doctorHospitals is null)
                return null;
            return doctorHospitals;
        }

        // Get Doctor Schedule by Doctor Id
        public async Task<IEnumerable<DoctorHospital>> GetDoctorScheduleByDoctorIdAsync(Guid doctorId)
        {
            var doctorHospitals = await _context.doctorHospitals
                .Where(dh => dh.DoctorId == doctorId)
                .ToListAsync();
            if (doctorHospitals is null)
                return null;
            return doctorHospitals;
        }

        // Get Doctor Schedule by Doctor Id and Hospital Id On the Given Date
        public async Task<IEnumerable<DoctorHospital>> GetDoctorScheduleAsync(Guid hospitalId, Guid doctorId, DayOfWeek dayOfWeek)
        {
            var doctorHospitals = await _context.doctorHospitals
                .Where(dh => dh.HospitalId == hospitalId && dh.DoctorId == doctorId && 
                       dh.Days != null && dh.Days.Contains(dayOfWeek))
                .Include(dh => dh.Doctor)
                    .ThenInclude(d => d.ApplicationUser)
                .Include(dh => dh.Doctor)
                    .ThenInclude(d => d.Category)
                .ToListAsync();

            if (doctorHospitals is null)
                return null;
            
            return doctorHospitals;
        }

        // Calculate Ratings for all doctors
        public async Task UpdateAllDoctorsAvgRatingAsync()
        {
            var ratings = await _context.reviews
                .Where(r => r.Appointment.DoctorId != null)
                .GroupBy(r => r.Appointment.DoctorId)
                .Select(g => new
                {
                    DoctorId = g.Key,
                    AvgRating = g.Average(r => r.Rating)
                })
                .ToListAsync();

            var doctors = await _context.doctors.ToListAsync();

            foreach (var doctor in doctors)
            {
                var rating = ratings.FirstOrDefault(r => r.DoctorId == doctor.Id);
                doctor.AvgRating = rating?.AvgRating;
            }

            await _context.SaveChangesAsync();
        }

        // Calculate Doctor Rating
        public async Task CalculateAvgRatingAsync(Guid doctorId)
        {
            var average = await _context.reviews
                .Where(r => r.Appointment.DoctorId == doctorId)
                .AverageAsync(r => (double?)r.Rating);

            var doctor = await _context.doctors.FindAsync(doctorId);
            if (doctor is null)
                throw new KeyNotFoundException($"Doctor with id {doctorId} not found.");
            doctor.AvgRating = average;
        }

        // Update Doctor Schedule
        public async Task UpdateDoctorScheduleAsync(DoctorHospital doctorHospital)
        {
            var existingdoctorHospital = await _context.doctorHospitals
                .FirstOrDefaultAsync(dh => dh.DoctorId == doctorHospital.DoctorId && dh.HospitalId == doctorHospital.HospitalId);
            
            if(existingdoctorHospital is null)
                throw new KeyNotFoundException($"Doctor with this Hospital not found.");

            existingdoctorHospital.StartTime = doctorHospital.StartTime;
            existingdoctorHospital.EndTime = doctorHospital.EndTime;
            existingdoctorHospital.Days = doctorHospital.Days;
        }
        
        // Remove Doctor
        public async Task RemoveDoctorAsync(Guid doctorId, Guid hospitalId)
        {
            var doctorHospital = await _context.doctorHospitals
                .FirstOrDefaultAsync(dh => dh.DoctorId == doctorId && dh.HospitalId == hospitalId);

            if (doctorHospital is null)
            {
                throw new KeyNotFoundException($"Doctor with id {doctorId} is not mapped to hospital with id {hospitalId}.");
            }

            _context.doctorHospitals.Remove(doctorHospital);
        }
    
    }
}
