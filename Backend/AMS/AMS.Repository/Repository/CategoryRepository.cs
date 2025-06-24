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
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        private readonly AppointmentDbContext _context;

        public CategoryRepository(AppointmentDbContext context) : base(context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<Category>> GetAllCategories()
        {
            var categories = await _context.categories
                .Include(c => c.Doctors)
                .Include(c => c.Hospitals)
                    .ThenInclude(ch => ch.Hospital)
                .ToListAsync();

            if (categories == null || !categories.Any())
                return null;

            return categories;
        }

        public async Task<Category> GetById(Guid id)
        {
            var category = await _context.categories
                .Include(c => c.Doctors)
                .Include(c => c.Hospitals)
                    .ThenInclude(ch => ch.Hospital)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
                return null;

            return category;
        }

        public async Task<IEnumerable<Category>> GetCategoryByHospitalId(Guid hospitalId)
        {
            var categories = await _context.categories
                .Include(c => c.Doctors)
                .Include(c => c.Hospitals)
                    .ThenInclude(ch => ch.Hospital)
                .Where(c => c.Hospitals.Any(ch => ch.HospitalId == hospitalId))
                .ToListAsync();

            if (categories == null || !categories.Any())
                return null;

            return categories;
        }

        public async Task<IEnumerable<Category>> GetCategoryByName(string name)
        {
            var categories = await _context.categories
                .Include(c => c.Doctors)
                .Include(c => c.Hospitals)
                    .ThenInclude(ch => ch.Hospital)
                .Where(c => c.Name.ToLower().Contains(name.ToLower()))
                .ToListAsync();

            if (categories is null || !categories.Any())
                return null;

            return categories;
        }

        public async Task UpdateCategoryAsync(Category category)
        {
            var existingCategory = await _context.categories
                .Include(c => c.Doctors)
                .Include(c => c.Hospitals)
                    .ThenInclude(ch => ch.Hospital)
                .FirstOrDefaultAsync(c => c.Id == category.Id);

            existingCategory.Name = category.Name;
        }

        public async Task AddCategoryToHospitalAsync(CategoryHospital categoryHospital)
        {
           await _context.categoryHospitals.AddAsync(categoryHospital);
        }

        public void RemoveCategoryFromHospitalAsync(Guid hospitalId, Guid categoryId)
        {
            var categoryHospital = _context.categoryHospitals
                .FirstOrDefault(ch => ch.HospitalId == hospitalId && ch.CategoryId == categoryId);
            if(categoryHospital == null)
            {
                throw new KeyNotFoundException($"CategoryHospital with HospitalId {hospitalId} and CategoryId {categoryId} not found.");
            }

            _context.categoryHospitals.Remove(categoryHospital);
        }
    }
}
