using AMS.Core.Entities;
using AMS.Core.Shared.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Shared.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAllCategories();
        Task<CategoryDto> GetCategoryById(Guid id);
        Task<IEnumerable<CategoryDto>> GetCategoryByName(string name);
        Task<IEnumerable<CategoryDto>> GetCategoryByHospitalId(Guid hospitalId);
        Task<CategoryDto> AddCategoryAsync(CreateCategoryDto createCategoryDto);
        Task<CategoryHospitalDto> AddCategoryToHospitalAsync(CategoryHospitalDto categoryHospitalDto);
        Task RemoveCategoryFromHospitalAsync(Guid hospitalId, Guid categoryId);
        Task UpdateCategoryAsync(CategoryDto categorydto);
        Task DeleteCategoryAsync(Guid id);
    }
}
