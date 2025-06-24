using AMS.Core.Entities;
using AMS.Core.Shared.DTOs;
using AMS.Core.Shared.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }


        /// <summary>
        /// GET ALL ENDPOINT 
        /// </summary>
        /// <returns> Returns All Categories </returns>

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategories();
            return Ok(categories);
        }

        /// <summary>
        /// GET CATEGORY BY ID ENDPOINT
        /// </summary>
        /// <param name="id"></param>
        /// <returns> Returns Category containing {id} </returns>

        [HttpGet]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetCategoryById(Guid id)
        {
            var category = await _categoryService.GetCategoryById(id);
            return Ok(category);
        }

        /// <summary>
        /// GET CATEGORY BY NAME ENDPOINT
        /// </summary>
        /// <param name="name"></param>
        /// <returns> Returns Categories containing {name} </returns>

        [HttpGet]
        [Route("{name}")]
        public async Task<IActionResult> GetCategoryByName(string name)
        {
            var categories = await _categoryService.GetCategoryByName(name);
            return Ok(categories);
        }

        /// <summary>
        /// GET CATEGORY BY HOSPITAL ID ENDPOINT
        /// </summary>
        /// <param name="hospitalId"></param>
        /// <returns> Returns Categories containing {hospitalId} </returns>

        [HttpGet]
        [Route("hospital/{hospitalId:guid}")]
        public async Task<IActionResult> GetCategoryByHospitalId(Guid hospitalId)
        {
            var categories = await _categoryService.GetCategoryByHospitalId(hospitalId);
            return Ok(categories);
        }

        /// <summary>
        /// ADD CATEGORY ENDPOINT
        /// </summary>
        /// <param name="createCategoryDto"></param>

        [HttpPost]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> AddCategory([FromBody] CreateCategoryDto createCategoryDto)
        {
            if (createCategoryDto == null)
            {
                return BadRequest("Category data is null.");
            }

            var category = await _categoryService.AddCategoryAsync(createCategoryDto);
            return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
        }

        /// <summary>
        /// UPDATE CATEGORY BY ID ENDPOINT
        /// </summary>
        /// <param name="id"></param>
        /// <param name="categoryDto"></param>

        [HttpPut]
        [Route("{id:guid}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] CategoryDto categoryDto)
        {
            if (categoryDto == null || categoryDto.Id != id)
            {
                return BadRequest("Category data is invalid.");
            }
            await _categoryService.UpdateCategoryAsync(categoryDto);
            return NoContent();
        }

        /// <summary>
        /// ADD CATEGORY TO HOSPITAL ENDPOINT
        /// </summary>
        /// <param name="categoryHospitalDto"></param>
        /// <returns></returns>

        [HttpPost]
        [Route("add-category")]
        [Authorize(Roles = "SuperAdmin, HospitalAdmin")]
        public async Task<IActionResult> AddCategoryToHospital([FromBody] CategoryHospitalDto categoryHospitalDto) 
        {
            if (categoryHospitalDto == null)
                return BadRequest("Data is Invalid.");

            await _categoryService.AddCategoryToHospitalAsync(categoryHospitalDto);
            return CreatedAtAction(nameof(GetCategoryById), new { id = categoryHospitalDto.CategoryId }, categoryHospitalDto);
        }

        /// <summary>
        /// REMOVE CATEGORY FROM HOSPITAL ENDPOINT
        /// </summary>
        /// <param name="categoryHospitalDto"></param>
        /// <returns></returns>
        
        [HttpDelete]
        [Route("remove-category")]
        [Authorize(Roles = "SuperAdmin, HospitalAdmin")]
        public async Task<IActionResult> RemoveCategoryFromHospital([FromQuery] Guid hospitalId, [FromQuery] Guid categoryId)
        {
            await _categoryService.RemoveCategoryFromHospitalAsync(hospitalId, categoryId);
            return NoContent();
        }

        /// <summary>
        /// DELETE CATEGORY BY ID ENDPOINT
        /// </summary>
        /// <param name="id"></param>

        [HttpDelete]
        [Route("{id:guid}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            if (id == Guid.Empty)
            {
                return BadRequest("Invalid category ID.");
            }
            await _categoryService.DeleteCategoryAsync(id);
            return NoContent();
        }
    }
}
