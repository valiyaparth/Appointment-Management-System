using AMS.Core.Interfaces;
using AMS.Core.Shared.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// LOGIN ENDPOINT
        /// </summary>
        /// <param name="loginDto"></param>
        /// <returns> Returns JWT Token with approptiate claims </returns>

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var token = await _authService.LoginAsync(loginDto);
            return token == null ? Unauthorized("Invalid Credentials, Please Try again!"): Ok(token);
        }

        /// <summary>
        /// REGISTER ENDPOINT
        /// </summary>
        /// <param name="registerDto"></param>

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            var (succeeded, error)  = await _authService.RegisterAsync(registerDto);

            if(!succeeded)
                return Conflict(error);

            return Ok("Registration successful. Please check your email to confirm your account.");
        }


        /// <summary>
        /// CONFIRM EMAIL ENDPOINT
        /// </summary>
        /// <param name="confirmEmailDto"></param>

        [HttpPost("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailDto confirmEmailDto)
        {
            if (confirmEmailDto == null || string.IsNullOrEmpty(confirmEmailDto.UserId) || string.IsNullOrEmpty(confirmEmailDto.Token))
            {
                return BadRequest("Invalid confirmation data.");
            }
            var (result, email)= await _authService.ConfirmEmailAsync(confirmEmailDto);
            return result ? Ok(email) : BadRequest($"Email confirmation failed for {email}");
        }


        /// <summary>
        /// SET PASSWORD ENDPOINT
        /// </summary>
        /// <param name="setPasswordDto"></param>
        /// <returns></returns>

        [HttpPost("set-password")]
        public async Task<IActionResult> SetPassword([FromBody] SetPasswordDto setPasswordDto)
        {
            if (setPasswordDto == null || string.IsNullOrEmpty(setPasswordDto.Email) || string.IsNullOrEmpty(setPasswordDto.Password))
            {
                return BadRequest("Invalid password data.");
            }
            var result = await _authService.SetPasswordAsync(setPasswordDto);
            return result ? Ok("Password set successfully") : BadRequest("Failed to set password");
        }

        /// <summary>
        /// CHANGE PASSWORD ENDPOINT
        /// </summary>
        /// <param name="changePasswordDto"></param>
        /// <returns></returns>

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            if (changePasswordDto == null || string.IsNullOrEmpty(changePasswordDto.OldPassword) || string.IsNullOrEmpty(changePasswordDto.NewPassword))
            {
                return BadRequest("Invalid password change data.");
            }
            var result = await _authService.ChangePasswordAsync(changePasswordDto);
            return result ? Ok("Password changed successfully") : BadRequest("Failed to change password");
        }
    }
}
