using AMS.Core.Interfaces;
using AMS.Core.Shared.DTOs;
using AMS.Repository.Repository.IRepository;
using AMS.Repository.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HospitalController : ControllerBase
    {
        private readonly IHospitalSerivce _hospitalService;

        public HospitalController(IHospitalSerivce hospitalService)
        {
            _hospitalService = hospitalService ?? throw new ArgumentNullException(nameof(hospitalService));
        }

        /// <summary>
        /// GET ALL HOSPITAL ENDPOINT
        /// </summary>
        /// <returns> Returns All Hospitals </returns>

        [HttpGet]
        public async Task<IActionResult> GetAllHospitals()
        {
            var hospitals = await _hospitalService.GetAllHospitalsAsync();
            return Ok(hospitals);
        }


        /// <summary>
        /// GET BY HOSPITAL BY ID ENDPOINT
        /// </summary>
        /// <param name="id"></param>
        /// <returns> Returns Hospital Containing id </returns>

        [HttpGet]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetHospitalById(Guid id)
        {
            var hospital = await _hospitalService.GetHospitalByIdAsync(id);
            if (hospital == null)
            {
                return NotFound();
            }
            return Ok(hospital);
        }


        /// <summary>
        /// GET HOSPITAL BY CATEGORYID ENDPOINT
        /// </summary>
        /// <param name="categoryId"></param>
        /// <returns> Returns Hospital Containing categoryId</returns>

        [HttpGet]
        [Route("category/{categoryId:guid}")]
        public async Task<IActionResult> GetHospitalsByCategoryId(Guid categoryId)
        {
            var hospitals = await _hospitalService.GetHospitalsByCategoryIdAsync(categoryId);
            return Ok(hospitals);
        }


        /// <summary>
        /// GET HOSPITAL BY DOCTORID ENDPOINT
        /// </summary>
        /// <param name="doctorId"></param>
        /// <returns> Returns Hospital Containing doctorId</returns>

        [HttpGet]
        [Route("doctor/{doctorId:guid}")]
        public async Task<IActionResult> GetHospitalsByDoctorId(Guid doctorId)
        {
            var hospitals = await _hospitalService.GetHospitalsByDoctorIdAsync(doctorId);
            return Ok(hospitals);
        }

        [HttpGet]
        [Route("name/{name}")]
        public async Task<IActionResult> GetHospitalsByName(string name)
        {
            var hospitals = await _hospitalService.GetHospitalsByNameAsync(name);

            return Ok(hospitals);
        }

        /// <summary>
        /// ADD HOSPITAL ENDPOINT
        /// </summary>  
        /// <param name="createHospitalDto"></param>

        [HttpPost]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> AddHospital([FromBody] CreateHospitalDto createHospitalDto)
        {
            if (createHospitalDto == null)
            {
                return NotFound("Hospital data is null");
            }
            var hospitalDto = await _hospitalService.AddHospitalAsync(createHospitalDto);

            return CreatedAtAction(nameof(GetHospitalById), new { id = hospitalDto.Id}, hospitalDto);
        }


        /// <summary>
        /// UPDATE HOSPITAL ENDPOINT
        /// </summary>
        /// <param name="id"></param>
        /// <param name="hospitalDto"></param>

        [HttpPut]
        [Route("{id:guid}")]
        [Authorize(Roles = "SuperAdmin, HospitalAdmin")]
        public async Task<IActionResult> UpdateHospital(Guid id, [FromBody] HospitalDto hospitalDto)
        {
            if (hospitalDto == null || hospitalDto.Id != id)
            {
                return NotFound("Hospital Data is Null");
            }
            var existingHospital = await _hospitalService.GetHospitalByIdAsync(id);
            if (existingHospital == null)
            {
                return NotFound();
            }
            await _hospitalService.UpdateHospitalAsync(hospitalDto);
            return NoContent();
        }

        /// <summary>
        /// DELETE HOSPITAL ENDPOINT
        /// </summary>
        /// <param name="id"></param>

        [HttpDelete]
        [Route("{id:guid}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> DeleteHospitalAsync(Guid id)
        {
            var hospital = await _hospitalService.GetHospitalByIdAsync(id);
            if (hospital == null)
            {
                return NotFound();
            }
            await _hospitalService.DeactivateHospitalAsync(id);
            return NoContent();
        }
    }
}
