using AMS.Core.Entities;
using AMS.Core.Shared.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Interfaces
{
    public interface IHospitalSerivce
    {
        Task<IEnumerable<HospitalDto>> GetAllHospitalsAsync();
        Task<HospitalDto> GetHospitalByIdAsync(Guid hospitalId);
        Task<IEnumerable<HospitalDto>> GetHospitalsByCategoryIdAsync(Guid categoryId);
        Task<IEnumerable<HospitalDto>> GetHospitalsByDoctorIdAsync(Guid doctorId);
        Task<IEnumerable<HospitalDto>> GetHospitalsByNameAsync(string name);
        Task<HospitalDto> AddHospitalAsync(CreateHospitalDto createHospitalDto);
        Task UpdateHospitalAsync(HospitalDto hospitalDto);
        Task DeactivateHospitalAsync(Guid id);
    }
}
