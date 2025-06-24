using AMS.Core.Shared.DTOs;
using AMS.Core.Shared.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService ?? throw new ArgumentNullException(nameof(appointmentService));
        }

        /// <summary>
        /// GET APPOINTMENT BY ID ENDPOINT
        /// </summary>
        /// <param name="appointmentId"></param>
        /// <returns> Returns Appointment conatining {id} </returns>

        [HttpGet("{appointmentId:guid}", Name = "GetAppointmentById")]
        public async Task<IActionResult> GetAppointmentByIdAsync(Guid appointmentId)
        {
            var appointment = await _appointmentService.GetAppointmentByIdAsync(appointmentId);
            if (appointment == null)
            {
                return NotFound();
            }
            return Ok(appointment);
        }


        /// <summary>
        /// GET APPOINTMENT BY PATIENT ID ENDPOINT
        /// </summary>
        /// <param name="patientId"></param>
        /// <returns> Returns Appointment associated with Patient containing {patientId} </returns>

        [HttpGet]
        [Route("patient/{patientId:guid}")]
        public async Task<IActionResult> GetAppointmentByPatientIdAsync(string patientId)
        {
            var appointments = await _appointmentService.GetAppointmentsByUserIdAsync(patientId);
            return Ok(appointments);
        }

        /// <summary>
        /// GET APPOINTMENT BY DOCTOR ID ENDPOINT
        /// </summary>
        /// <param name="doctorId"></param>
        /// <returns> Returns Appointment associated with Doctor containing {doctorId} </returns>

        [HttpGet]
        [Route("doctor/{doctorId:guid}")]
        [Authorize(Roles = "SuperAdmin,HospitalAdmin,Doctor")]
        public async Task<IActionResult> GetAppointmentByDoctorIdAsync(Guid doctorId)
        {
            var appointments = await _appointmentService.GetAppointmentsByDoctorIdAsync(doctorId);
            return Ok(appointments);
        }

        /// <summary>
        /// GET APPOINTMENT BY HOSPITAL ID ENDPOINT
        /// </summary>
        /// <param name="hospitalId"></param>
        /// <returns> Returns Appointment associated with Hospital containing {hospitalId} </returns>
        [HttpGet]
        [Route("hospital/{hospitalId:guid}")]
        [Authorize(Roles = "SuperAdmin,HospitalAdmin")]
        public async Task<IActionResult> GetAppointmentByHospitalIdAsync(Guid hospitalId)
        {
            var appointments = await _appointmentService.GetAppointmentsByHosiptalIdAsync(hospitalId);
            return Ok(appointments);
        }


        /// <summary>
        /// GET APPOINTMENTS BY HOSPITAL ID AND DATE ENDPOINT
        /// </summary>
        /// <param name="hospitalId"></param>
        /// <param name="date"></param>
        /// <returns></returns>

        [HttpGet]
        [Route("hospital/date")]
        [Authorize(Roles = "SuperAdmin,HospitalAdmin")]
        public async Task<IActionResult> GetAppointmentsByHospitalIdByDateAsync([FromQuery] Guid hospitalId, [FromQuery] DateOnly date)
        {
            var appointments = await _appointmentService.GetAppointmentsByHosiptalIdByDateAsync(hospitalId, date);
            return Ok(appointments);
        }


        [HttpGet]
        [Route("hospital/doctor")]
        [Authorize(Roles = "SuperAdmin,HospitalAdmin")]
        public async Task<IActionResult> GetAppointmentsByHospitalIdByDateByDoctorAsync([FromQuery] Guid hospitalId, [FromQuery] Guid doctorId, [FromQuery] DateOnly date)
        {
            var appointments = await _appointmentService.GetAppointmentsByHosiptalIdByDateByDoctorAsync(hospitalId, doctorId, date);
            return Ok(appointments);
        }

        /// <summary>
        /// ADD APPOINTMENT ENDPOINT
        /// </summary>
        /// <param name="createAppointmentDto"></param>

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddAppointmentAsync(CreateAppointmentDto createAppointmentDto)
        {
            if (createAppointmentDto == null)
            {
                return BadRequest("Invalid appointment data.");
            }
            var appointment = await _appointmentService.AddAppointmentAsync(createAppointmentDto);
            
            if (appointment == null)
            {
                return Conflict("An appointment already exists for the specified date and time.");
            }
            else
            {
                return CreatedAtAction("GetAppointmentById", new { appointmentId = appointment.Id }, appointment);
            }
        }

        /// <summary>
        /// UPDATE APPOINTMENT ENDPOINT
        /// </summary>
        /// <param name="appointmentDto"></param>
        /// <returns></returns>

        [HttpPut]
        [Route("update/{appointmentId:Guid}")]
        [Authorize]
        public async Task<IActionResult> UpdateAppointmentAsync(Guid appointmentId, AppointmentDto appointmentDto)
        {
            if (appointmentDto == null)
            {
                return BadRequest("Invalid appointment data.");
            }
            await _appointmentService.UpdateAppointmentAsync(appointmentId, appointmentDto);
            return NoContent();
        }


        /// <summary>
        /// COMPLETE APPOINTMENT ENDPOINT
        /// </summary>
        /// <param name="appointmentId"></param>
        /// <param name="appointmentDto"></param>
        /// <returns></returns>

        [HttpPut]
        [Route("complete/{appointmentId:guid}")]
        public async Task<IActionResult> CompleteAppointmentAsync(Guid appointmentId)
        {
            await _appointmentService.CompleteAppointmentAsync(appointmentId);
            return NoContent();
        }


        /// <summary>
        /// CANCEL APPOINTMENT ENDPOINT
        /// </summary>
        /// <param name="appointmentDto"></param>

        [HttpPut]
        [Route("cancel/{appointmentId:Guid}")]
        [Authorize]
        public async Task<IActionResult> CancelAppointmentAsync(Guid appointmentId)
        {
            await _appointmentService.CancelAppointmentAsync(appointmentId);
            return NoContent();
        }


        /// <summary>
        /// ADD REVIEW ENDPOINT
        /// </summary>
        /// <param name="createReviewDto"></param>
        /// <returns></returns>

        [HttpPost]
        [Route("add-review")]
        [Authorize]
        public async Task<IActionResult> AddReview(CreateReviewDto createReviewDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }
            await _appointmentService.SubmitReviewAsync(userId, createReviewDto);
            return NoContent();
        }


        /// <summary>
        /// ADD REPLY ENDPOINT
        /// </summary>
        /// <param name="replyDto"></param>
        /// <returns></returns>

        [HttpPost]
        [Route("add-reply")]
        [Authorize]
        public async Task<IActionResult> AddReply(ReplyDto replyDto)
        {
            await _appointmentService.AddReplyAsync(replyDto);
            return NoContent();
        }
    }
}
