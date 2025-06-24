using AMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Repository.IRepository
{
    public interface IAppointmentRepository : IRepository<Appointment>
    {
        Task<IEnumerable<Appointment>> GetAppointmentsByUserIdAsync(string userId);
        Task<Appointment> GetAppointmentByUserIdAsync(Guid appointmentId, string userId);
        Task<IEnumerable<Appointment>> GetAppointmentsByDoctorIdAsync(Guid doctorId);
        Task<IEnumerable<Appointment>> GetAppointmentsByHosiptalIdAsync(Guid hosiptalId);
        Task<IEnumerable<Appointment>> GetAppointmentsByHosiptalIdByDateAsync(Guid hosiptalId, DateOnly date);
        Task<IEnumerable<Appointment>> GetAppointmentSlotsAsync(Guid hospitalId, Guid doctorId, DateOnly date);
        Task<IEnumerable<TimeOnly>> GetBookedAppointmentSlotsAsync(Guid hospitalId, Guid doctorId, DateOnly date);
        Task<bool> AppointmentExist(Guid hospitalId, Guid doctorId, DateOnly date, TimeOnly time);
        Task<Appointment> GetAppointmentByIdAsync(Guid appointmentId);
        Task UpdateAsync(Appointment appointment);
    }
}
