using AMS.Core.Shared.DTOs;
using AMS.Core.Shared.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Security.Claims;

namespace AMS.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationUserController : ControllerBase
    {
        private readonly IApplicationUserService _applicationUserService;
        public ApplicationUserController(IApplicationUserService applicationUserService)
        {
            _applicationUserService = applicationUserService;
        }


        /// <summary>
        /// GET USER BY ID ENDPOINT
        /// </summary>
        /// <param name="id"></param>
        /// <returns> Returns User containing {id} </returns>

        [HttpGet("GetUserById/{id}")]
        public async Task<IActionResult> GetUserByIdAsync(string id)
        {
            var user = await _applicationUserService.GetByIdAsync(id);

            return Ok(user);
        }

        /// <summary>
        /// GET USER BY EMAILID ENDPOINT
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>

        [HttpGet("GetUserByEmail/{email}")]
        public async Task<IActionResult> GetUserByEmailAsync(string email)
        {
            var user = await _applicationUserService.GetUserByEmailAsync(email);

            return Ok(user);
        }

        /// <summary>
        /// GET USERS BY NAME ENDPOINT
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        [HttpGet("GetUserByName/{name}")]
        public async Task<IActionResult> GetUsersByNameAsync(string name)
        {
            var users = await _applicationUserService.GetUsersByNameAsync(name);

            return Ok(users);
        }

        /// <summary>
        /// GET USERS BY HOSPITAL ID ENDPOINT
        /// </summary>
        /// <param name="hospitalId"></param>
        /// <returns> Returns User containing {hospitalId} </returns>

        [HttpGet("GetUsersByHospitalId/{hospitalId}")]
        public async Task<IActionResult> GetUsersByHospitalIdAsync(Guid hospitalId)
        {
            var users = await _applicationUserService.GetUserByHospitalIdAsync(hospitalId);
            return Ok(users);
        }

        /// <summary>
        /// GET HOSPITAL ADMIN ENDPOINT
        /// </summary>
        /// <param name="hospitalId"></param>
        /// <returns></returns>

        [HttpGet("GetHospitalAdmin/{hospitalId}")]
        public async Task<IActionResult> GetHospitalAdminAsync(Guid hospitalId)
        {
            var user = await _applicationUserService.GetHospitalAdminAsync(hospitalId);
            return Ok(user);
        }

        /// <summary>
        /// UPDATE USER ENDPOINT
        /// </summary>
        /// <param name="registerDto"></param>

        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUserAsync([FromBody] RegisterDto registerDto)
        {
            if (registerDto == null)
            {
                return BadRequest("User data is null");
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }
            await _applicationUserService.UpdateUserAsync(userId, registerDto);
            return NoContent();
        }
    }
}
