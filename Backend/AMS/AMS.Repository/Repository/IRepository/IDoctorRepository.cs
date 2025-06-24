using AMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Repository.IRepository
{
    public interface IDoctorRepository : IRepository<Doctor>
    {
        Task<IEnumerable<Doctor>> GetDoctorsByHospitalIdAsync(Guid hospitalId);
        Task<Doctor> GetDoctorByIdAsync(Guid doctorId);
        Task<IEnumerable<Doctor>> GetDoctorsByCategoryAsync(Guid categoryId);
        Task<IEnumerable<Doctor>> GetDoctorsByNameAsync(string name);
        Task<IEnumerable<Doctor>> GetAllDoctorsAsync();
        Task UpdateDoctorAsync(Doctor doctor);
        Task RemoveDoctorAsync(Guid doctorId, Guid hospitalId);
        Task<IEnumerable<DoctorHospital>> GetDoctorScheduleAsync(Guid hospitalId);
        Task<IEnumerable<DoctorHospital>> GetDoctorScheduleByDoctorIdAsync(Guid doctorId);
        Task UpdateAllDoctorsAvgRatingAsync();
        Task CalculateAvgRatingAsync(Guid doctorId);
        Task UpdateDoctorScheduleAsync(DoctorHospital doctorHospital);
        Task AddDoctorToHospitalAsync(DoctorHospital doctorHospital);
        Task<IEnumerable<DoctorHospital>> GetDoctorScheduleAsync(Guid hospitalId, Guid doctorId, DayOfWeek dayOfWeek);
    }
}
