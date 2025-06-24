using AMS.Core.Entities;
using AMS.Core.Interfaces;
using AMS.Core.Shared.DTOs;
using AMS.Core.Shared.EmailService;
using AMS.Core.Shared.Settings;
using AMS.EnitityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace AMS.Repository.Services
{
    public class AuthService : IAuthService
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IEmailGenerator _emailGenerator;
        private readonly JwtSettings _jwtSettings;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AppointmentDbContext _context;

        //Injecting dependencies through constructor
        public AuthService(UserManager<ApplicationUser> userManager,
                           SignInManager<ApplicationUser> signInManager,
                           RoleManager<IdentityRole> roleManager,
                           IOptions<JwtSettings> jwtSettings,
                           IEmailGenerator emailGenerator,
                           IHttpContextAccessor httpContextAccessor,
                           AppointmentDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _jwtSettings = jwtSettings.Value;
            _emailGenerator = emailGenerator;
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }


        // Login
        public async Task<LoginResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null)
                return new LoginResponseDto { Success = false, Message = "Invalid email or password." };

            if (!user.EmailConfirmed)
                return new LoginResponseDto { Success = false, Message = $"Please Confirm Your Email. Sent on {user.Email}" };

            var passwordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!passwordValid)
                return new LoginResponseDto { Success = false, Message = "Invalid email or password." };

            // Get the role of User
            var roles = await _userManager.GetRolesAsync(user);

            // Check for the activation status of the Hospital
            if (roles.Contains("HospitalAdmin"))
            {
                if (!user.HospitalId.HasValue)
                    return new LoginResponseDto { Success = false, Message = "HospitalAdmin must be associated with a hospital." };
                
                var hospital = await _context.hospitals.FindAsync(user.HospitalId.Value);

                if (user.Hospital == null)
                    return new LoginResponseDto { Success = false, Message = "Associated hospital not found." };

                if (!user.Hospital.IsActive)
                    return new LoginResponseDto { Success = false, Message = "Your Hospital is Deactivated. Please Contact SuperAdmin" };
            }

            // Create claims for the JWT token
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name,user.FullName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };


            // Add roles to claims
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));


            // For Hospital Admins add hospitalId in claim
            if (roles.Contains("HospitalAdmin") && user.HospitalId.HasValue)
                claims.Add(new Claim("HospitalId", user.HospitalId.Value.ToString()));


            // Create the JWT token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes);


            // Create the token with claims and expiration
            var token = new JwtSecurityToken(
                _jwtSettings.Issuer,
                _jwtSettings.Audience,
                claims,
                expires: expires,
                signingCredentials: creds
            );


            // Return the response
            return new LoginResponseDto
            {
                Success = true,
                Message = "Login successful.",
                Data = new JwtResponseDto
                {
                    Token = new JwtSecurityTokenHandler().WriteToken(token),
                    ExpiresAt = expires
                }
            };
        }


            // Register
            public async Task<(bool Succeeded, string? Error)> RegisterAsync(RegisterDto registerDto)
            {
                var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
                if (existingUser != null)
                {
                    return (false, $"Account with EmailId: {registerDto.Email} already exists.");
                
                }
                else
                {
                    var user = new ApplicationUser
                    {
                        UserName = registerDto.Email,
                        Email = registerDto.Email,
                        FullName = registerDto.FullName,
                        PhoneNumber = registerDto.PhoneNumber,
                        DateOfBirth = registerDto.DateOfBirth,
                        NormalizedEmail = _userManager.NormalizeEmail(registerDto.Email)
                    };

                    //create user with 
                    var result = await _userManager.CreateAsync(user);

                    if (!result.Succeeded) return (false, $"Failed to create User");

                    //add role into user table
                    await _userManager.AddToRoleAsync(user, "Patient");

                    // Send Email to user
                    await _emailGenerator.GenerateEmailConfirmationLinkAsync(user);

                return (true, null);
                }
            }


        // Confirm Email
        public async Task<(bool, string? email)> ConfirmEmailAsync(ConfirmEmailDto confirmEmailDto)
        {
            var user = await _userManager.FindByIdAsync(confirmEmailDto.UserId);
            var email = user.Email;
            if (user == null) return (false, email);

            var token = HttpUtility.UrlDecode(confirmEmailDto.Token);
            var result = await _userManager.ConfirmEmailAsync(user, token);
            if(!result.Succeeded) return (false, email);

            return (true, email);
        }


        // Set Password
        public async Task<bool> SetPasswordAsync(SetPasswordDto setPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(setPasswordDto.Email);
            if (user == null || !await _userManager.IsEmailConfirmedAsync(user)) return false;

            var result = await _userManager.AddPasswordAsync(user, setPasswordDto.Password);
            return result.Succeeded;
        }


        // Change Password
        public async Task<bool> ChangePasswordAsync(ChangePasswordDto changePasswordDto)
        {
            var user = await _userManager.GetUserAsync(_httpContextAccessor.HttpContext?.User);
            if (user == null) return false;

            var result = await _userManager.ChangePasswordAsync(user, changePasswordDto.OldPassword, changePasswordDto.NewPassword);
            return result.Succeeded;
        }
    }
}
