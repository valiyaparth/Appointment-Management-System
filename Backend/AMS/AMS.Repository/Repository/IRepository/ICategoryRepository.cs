using AMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Repository.IRepository
{
    public interface ICategoryRepository : IRepository<Category>
    {
        Task<Category> GetById(Guid id);
        Task<IEnumerable<Category>> GetAllCategories();
        Task<IEnumerable<Category>> GetCategoryByName(string name);
        Task<IEnumerable<Category>> GetCategoryByHospitalId(Guid hospitalId);
        Task UpdateCategoryAsync(Category category);
        Task AddCategoryToHospitalAsync(CategoryHospital categoryHospital);
        void RemoveCategoryFromHospitalAsync(Guid hospitalId, Guid categoryId);
    }
}
