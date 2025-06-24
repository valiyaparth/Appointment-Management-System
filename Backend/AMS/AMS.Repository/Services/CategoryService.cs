using AMS.Core.Entities;
using AMS.Core.Shared.DTOs;
using AMS.Core.Shared.Interfaces;
using AMS.Repository.Repository.IRepository;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitofWork _unitofWork;
        private readonly IMapper _mapper;

        public CategoryService(IUnitofWork unitofWork, IMapper mapper)
        {
            _unitofWork = unitofWork;
            _mapper = mapper;
        }

        // Get All Categories
        public async Task<IEnumerable<CategoryDto>> GetAllCategories()
        {
            var categories = await _unitofWork.Category.GetAllCategories();

            return _mapper.Map<IEnumerable<CategoryDto>>(categories);
        }


        // Get Category By Id
        public async Task<CategoryDto> GetCategoryById(Guid id)
        {
            var category = await _unitofWork.Category.GetById(id);

            return _mapper.Map<CategoryDto>(category);
        }


        // Get Category By Hospital Id
        public async Task<IEnumerable<CategoryDto>> GetCategoryByHospitalId(Guid hospitalId)
        {
            var categories = await _unitofWork.Category.GetCategoryByHospitalId(hospitalId);

            return _mapper.Map<IEnumerable<CategoryDto>>(categories);
        }


        // Get Category By Name
        public async Task<IEnumerable<CategoryDto>> GetCategoryByName(string name)
        {
            var categories = await _unitofWork.Category.GetCategoryByName(name);

            return _mapper.Map<IEnumerable<CategoryDto>>(categories);
        }


        // Add Category
        public async Task<CategoryDto> AddCategoryAsync(CreateCategoryDto createCategoryDto)
        {
            var category = _mapper.Map<Category>(createCategoryDto);
            category.Id = Guid.NewGuid();

            await _unitofWork.Category.AddAsync(category);
            await _unitofWork.SaveAsync();

            return _mapper.Map<CategoryDto>(category);
        }

        // Add Category To Hospital
        public async Task<CategoryHospitalDto> AddCategoryToHospitalAsync(CategoryHospitalDto categoryHospitalDto)
        {
            var categoryHospital = _mapper.Map<CategoryHospital>(categoryHospitalDto);

            await _unitofWork.Category.AddCategoryToHospitalAsync(categoryHospital);
            await _unitofWork.SaveAsync();

            return _mapper.Map<CategoryHospitalDto>(categoryHospital);
        }

        // Remove Category From Hospital
        public async Task RemoveCategoryFromHospitalAsync(Guid hospitalId, Guid categoryId)
        {
            var category = await _unitofWork.Category.GetById(categoryId);
            if (category == null)
            {
                throw new KeyNotFoundException($"Category with ID {categoryId} not found.");
            }

            var hospitals = await _unitofWork.Hospital.GetHospitalsByCategoryIdAsync(categoryId);
            if (hospitals == null || !hospitals.Any())
            {
                throw new KeyNotFoundException($"Hospital with CategoryId {categoryId} not found.");
            }
            _unitofWork.Category.RemoveCategoryFromHospitalAsync(hospitalId, categoryId);
            await _unitofWork.SaveAsync();
        }

        // Update Category
        public async Task UpdateCategoryAsync(CategoryDto categorydto)
        {
            var category = _mapper.Map<Category>(categorydto);

            await _unitofWork.Category.UpdateCategoryAsync(category);

            await _unitofWork.SaveAsync();
        }


        //Delete Category
        public async Task DeleteCategoryAsync(Guid id)
        {
            var category = await _unitofWork.Category.GetById(id);
            if (category == null)
            {
                throw new KeyNotFoundException($"Category with ID {id} not found.");
            }
            _unitofWork.Category.Delete(category);
            await _unitofWork.SaveAsync();
        }

    }
}
