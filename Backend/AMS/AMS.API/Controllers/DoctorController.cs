using AMS.Core.Shared.DTOs;
using AMS.Core.Shared.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorService _doctorService;

        public DoctorController(IDoctorService doctorService)
        {
            _doctorService = doctorService ?? throw new ArgumentNullException(nameof(doctorService));
        }

        /// <summary>
        /// GET ALL DOCTORS ENDPOINTS
        /// </summary>
        /// <returns></returns>

        [HttpGet]
        public async Task<IActionResult> GetAllDoctors()
        {
            var doctors = await _doctorService.GetAllDoctorsAsync();
            return Ok(doctors);
        }

        /// <summary>
        /// GET DOCTOR BY ID ENDPOINT
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        [HttpGet]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetDoctorById(Guid id)
        {
            var doctor = await _doctorService.GetDoctorByIdAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }
            return Ok(doctor);
        }

        /// <summary>
        /// GET DOCTORS BY NAME ENDPOINT
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>

        [HttpGet]
        [Route("name/{name}")]
        public async Task<IActionResult> GetDoctorsByName(string name)
        {
            var doctors = await _doctorService.GetDoctorsByNameAsync(name);
            return Ok(doctors);
        }


        /// <summary>
        /// GET DOCTORS BY HOSPITAL ID ENDPOINT
        /// </summary>
        /// <param name="hospitalId"></param>
        /// <returns></returns>

        [HttpGet]
        [Route("hospital/{hospitalId:guid}")]
        public async Task<IActionResult> GetDoctorsByHospitalId(Guid hospitalId)
        {
            var doctors = await _doctorService.GetDoctorsByHospitalIdAsync(hospitalId);
            return Ok(doctors);
        }


        /// <summary>
        /// GET DOCTORS BY CATEGORY ID ENDPOINT
        /// </summary>
        /// <param name="categoryId"></param>
        /// <returns></returns>

        [HttpGet]
        [Route("category/{categoryId:guid}")]
        public async Task<IActionResult> GetDoctorsByCategory(Guid categoryId)
        {
            var doctors = await _doctorService.GetDoctorsByCategoryAsync(categoryId);
            return Ok(doctors);
        }


        /// <summary>
        /// ADD DOCTOR ENDPOINT
        /// </summary>
        /// <param name="createDoctorDto"></param>
        /// <returns></returns>

        [HttpPost]
        [Authorize(Roles = "SuperAdmin, HospitalAdmin")]
        public async Task<IActionResult> AddDoctor([FromBody] CreateDoctorDto createDoctorDto)
        {
            if (createDoctorDto == null)
            {
                return BadRequest("Doctor data is null");
            }
            var doctor = await _doctorService.AddDoctorAsync(createDoctorDto);
            return CreatedAtAction(nameof(GetDoctorById), new { id = doctor.Id }, doctor);
        }

        /// <summary>
        /// UPDATE DOCTOR ENDPOINT
        /// </summary>
        /// <param name="id"></param>
        /// <param name="doctorDto"></param>
        /// <returns></returns>

        [HttpPut]
        [Route("{id:guid}")]
        [Authorize(Roles = "SuperAdmin, HospitalAdmin, Doctor")]
        public async Task<IActionResult> UpdateDoctor(Guid id, [FromBody] UpdateDoctorDto updateDoctorDto)
        {
            if (updateDoctorDto == null)
            {
                return BadRequest("Doctor data is invalid");
            }
            await _doctorService.UpdateDoctorAsync(id, updateDoctorDto);
            return NoContent();
        }


        /// <summary>
        /// GET DOCTOR SCHEDULE BY HOSPITALID ENDPOINT
        /// </summary>
        /// <param name="hospitalId"></param>
        /// <returns></returns>

        [HttpGet("get-schedule/{hospitalId:guid}")]
        public async Task<IActionResult> GetDoctorSchedule(Guid hospitalId)
        {
            var schedule = await _doctorService.GetDoctorScheduleAsync(hospitalId);
            if (schedule == null)
            {
                return NoContent();
            }
            return Ok(schedule);
        }


        /// <summary>
        /// GET DOCTOR SCHEDULE ENDPOINT
        /// </summary>
        /// <param name="doctorId"></param>
        /// <returns></returns>

        [HttpGet("get-schedule-by-doctor/{doctorId:guid}")]
        public async Task<IActionResult> GetDoctorScheduleByDoctorId(Guid doctorId)
        {
            var schedule = await _doctorService.GetDoctorScheduleByDoctorIdAsync(doctorId);
            if (schedule == null)
            {
                return NoContent();
            }
            return Ok(schedule);
        }

        /// <summary>
        /// GET DOCTOR TIME SLOTS ENDPOINT 
        /// </summary>
        /// <param name="hospitaId"></param>
        /// <param name="doctorId"></param>
        /// <param name="date"></param>
        /// <returns></returns>

        [HttpGet("timeslots")]
        public async Task<IActionResult> GetDoctorTimeSlots([FromQuery] Guid hospitalId, [FromQuery] Guid doctorId, [FromQuery] DateOnly date)
        {
            var slots = await _doctorService.GetTimeSlotsAsync(hospitalId, doctorId, date);
            return Ok(slots);
        }


        /// <summary>
        /// UPDATE DOCTOR SCHEDULE ENDPOINT
        /// </summary>
        /// <param name="doctorHospitalDto"></param>
        /// <returns></returns>

        [HttpPut("update-schedule")]
        [Authorize(Roles = "SuperAdmin, HospitalAdmin")]
        public async Task<IActionResult> UpdateDoctorSchedule([FromBody] DoctorHospitalDto doctorHospitalDto)
        {
            await _doctorService.UpdateDoctorScheduleAsync(doctorHospitalDto);
            return NoContent();
        }

        /// <summary>
        /// REMOVE DOCTOR ENDPOINT
        /// </summary>
        /// <param name="hospitalId"></param>
        /// <param name="doctorId"></param>
        /// <returns></returns>

        [HttpDelete]
        [Route("remove-doctor")]
        [Authorize(Roles = "SuperAdmin, HospitalAdmin")]
        public async Task<IActionResult> RemoveDoctor([FromQuery] Guid hospitalId, [FromQuery] Guid doctorId)
        {
            await _doctorService.RemoveDoctorAsync(hospitalId, doctorId);
            return NoContent();
        }

        /// <summary>
        /// GET ALL REVIEWS FOR A DOCTOR
        /// </summary>
        /// <param name="doctorId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get-reviews/doctor")]
        public async Task<IActionResult> GetReviewsByDoctorIdAsync([FromQuery] Guid doctorId)
        {
            var reviews = await _doctorService.GetReviewsByDoctorIdAsync(doctorId);
            if (reviews == null)
                return NoContent();
            return Ok(reviews);
        }
    }
}
