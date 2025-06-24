using AMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Repository.IRepository
{
    public interface IHospitalRepository : IRepository<Hospital>
    {
        Task<IEnumerable<Hospital>> GetAllHospitalsAsync();
        Task<Hospital> GetHospitalByIdAsync(Guid id);
        Task<IEnumerable<Hospital>> GetHospitalsByCategoryIdAsync(Guid categoryId);
        Task<IEnumerable<Hospital>> GetHospitalsByDoctorIdAsync(Guid? doctorId);
        Task<IEnumerable<Hospital>> GetHospitalsByNameAsync(string name);
        Task UpdateHospitalAsync(Hospital hospital);
    }
}
