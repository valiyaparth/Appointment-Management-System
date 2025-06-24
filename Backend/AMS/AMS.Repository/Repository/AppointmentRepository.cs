using AMS.Core.Entities;
using AMS.Core.Shared.Enums;
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
    public class AppointmentRepository : Repository<Appointment>, IAppointmentRepository
    {
        private readonly AppointmentDbContext _context;

        public AppointmentRepository(AppointmentDbContext context) : base(context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        // Get Appointment By Id
        public async Task<Appointment> GetAppointmentByIdAsync(Guid appointmentId)
        {
            // Fetching appointment by Id
            var appointment = await _context.appointments
                .Include(a => a.ApplicationUser)
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.ApplicationUser)
                .Include(a => a.Hospital)
                .Include(a => a.Review)
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment is null)
                return null;

            return appointment;
        }


        // Get Appointment associated with doctorId
        public async Task<IEnumerable<Appointment>> GetAppointmentsByDoctorIdAsync(Guid doctorId)
        {
            // Fetching all the appointments by DoctorId
            var appointments = await _context.appointments
               .Include(a => a.ApplicationUser)
               .Include(a => a.Doctor)
                   .ThenInclude(d => d.ApplicationUser)
               .Include(a => a.Hospital)
               .Include(a => a.Review)
               .Where(a => a.DoctorId == doctorId)
               .ToListAsync();

            if (appointments is null || !appointments.Any())
                return null;
            
            return appointments;
        }


        // Get Appointment associated with HospitalId
        public async Task<IEnumerable<Appointment>> GetAppointmentsByHosiptalIdAsync(Guid hosiptalId)
        {
            var appointments = await _context.appointments
               .Include(a => a.ApplicationUser)
               .Include(a => a.Doctor)
                   .ThenInclude(d => d.ApplicationUser)
               .Include(a => a.Hospital)
               .Include(a => a.Review)
               .Where(a => a.HospitalId == hosiptalId)
               .ToListAsync();

            if (appointments is null || !appointments.Any())
                return null;

            return appointments;
        }


        // Get Appointment associated with HospitalId by Date
        public async Task<IEnumerable<Appointment>> GetAppointmentsByHosiptalIdByDateAsync(Guid hosiptalId, DateOnly date)
        {
            var appointments = await _context.appointments
               .Include(a => a.ApplicationUser)
               .Include(a => a.Doctor)
                   .ThenInclude(d => d.ApplicationUser)
               .Include(a => a.Hospital)
               .Include(a => a.Review)
               .Where(a => a.HospitalId == hosiptalId && a.Date == date)
               .ToListAsync();

            if (appointments is null || !appointments.Any())
                return null;

            return appointments;
        }

        // Get Appointment by HospitalId and DoctorId on the given date
        public async Task<IEnumerable<Appointment>> 
            GetAppointmentSlotsAsync(Guid hosiptalId, Guid doctorId,DateOnly date)
        {
            var appointments = await _context.appointments
               .Include(a => a.ApplicationUser)
               .Include(a => a.Doctor)
                   .ThenInclude(d => d.ApplicationUser)
               .Include(a => a.Hospital)
               .Include(a => a.Review)
               .Where(a => a.HospitalId == hosiptalId && a.Date == date && a.DoctorId == doctorId)
               .ToListAsync();

            if (appointments is null || !appointments.Any())
                return null;

            return appointments;
        }

        // Get StartTimes of Appointment
        public async Task<IEnumerable<TimeOnly>> GetBookedAppointmentSlotsAsync(Guid hospitalId, Guid doctorId, DateOnly date)
        {
            var TimeSlots = await _context.appointments
                .Where(a => a.HospitalId == hospitalId && a.DoctorId == doctorId && a.Date == date && a.Status == Status.Booked)
                .Select(a => a.TimeSlot)
                .ToListAsync();

            return TimeSlots;
        }

        // Check for existing appointment
        public async Task<bool> AppointmentExist(Guid hospitalId, Guid doctorId, DateOnly date, TimeOnly time)
        {
            var existingAppointment = await _context.appointments.AnyAsync(
                a => a.HospitalId == hospitalId &&
                a.DoctorId == doctorId &&
                a.Date == date &&
                a.TimeSlot == time);

            return existingAppointment;
        }

        // Get Appointment associated with UserId
        public async Task<IEnumerable<Appointment>> GetAppointmentsByUserIdAsync(string userId)
        {
            var appointments = await _context.appointments
               .Include(a => a.ApplicationUser)
               .Include(a => a.Doctor)
                   .ThenInclude(d => d.ApplicationUser)
               .Include(a => a.Hospital)
               .Include(a => a.Review)
               .Where(a => a.ApplicationUserId == userId)
               .ToListAsync();

            if (appointments is null || !appointments.Any())
                return null;

            return appointments;
        }

        // Get Only One Appointment associated with userId
        public async Task<Appointment> GetAppointmentByUserIdAsync(Guid appointmentId, string userId)
        {
            var appointments = await _context.appointments
               .Include(a => a.ApplicationUser)
               .Include(a => a.Doctor)
                   .ThenInclude(d => d.ApplicationUser)
               .Include(a => a.Hospital)
               .Include(a => a.Review)
               .FirstOrDefaultAsync(a => a.ApplicationUserId == userId && a.Id == appointmentId);

            if (appointments is null)
                return null;

            return appointments;
        }

        // Update Appointment
        public async Task UpdateAsync(Appointment appointment)
        {
            var existingAppointment = await _context.appointments
               .Include(a => a.ApplicationUser)
               .Include(a => a.Doctor)
                   .ThenInclude(d => d.ApplicationUser)
               .Include(a => a.Hospital)
               .Include(a => a.Review)
               .FirstOrDefaultAsync(a => a.Id == appointment.Id);

            existingAppointment.Date = appointment.Date;
            existingAppointment.TimeSlot = appointment.TimeSlot;
            existingAppointment.Status = appointment.Status;
            existingAppointment.DoctorId = appointment.DoctorId;
        }
    }
}
