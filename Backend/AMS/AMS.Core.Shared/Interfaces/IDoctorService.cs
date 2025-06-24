using AMS.Core.Entities;
using AMS.Core.Shared.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Shared.Interfaces
{
    public interface IDoctorService
    {
        Task<IEnumerable<DoctorDto>> GetAllDoctorsAsync();
        Task<DoctorDto> GetDoctorByIdAsync(Guid doctorId);
        Task<IEnumerable<DoctorDto>> GetDoctorsByNameAsync(string name);
        Task<IEnumerable<DoctorDto>> GetDoctorsByHospitalIdAsync(Guid hospitalId);
        Task<IEnumerable<DoctorDto>> GetDoctorsByCategoryAsync(Guid categoryId);
        Task<DoctorDto> AddDoctorAsync(CreateDoctorDto createDoctorDto);
        Task UpdateDoctorAsync(Guid id, UpdateDoctorDto updateDoctorDto);
        Task<IEnumerable<DoctorHospitalDto>> GetDoctorScheduleAsync(Guid hospitalId);
        Task<IEnumerable<DoctorHospitalDto>> GetDoctorScheduleByDoctorIdAsync(Guid doctorId);
        Task<IEnumerable<TimeSlotDto>> GetTimeSlotsAsync(Guid hospitalId, Guid doctorId, DateOnly date);
        Task UpdateDoctorScheduleAsync(DoctorHospitalDto doctorHospitalDto);
        Task RemoveDoctorAsync(Guid hospitalId, Guid doctorId);
        Task<IEnumerable<ReviewDto>> GetReviewsByDoctorIdAsync(Guid doctorId);
    }
}
