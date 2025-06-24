using AMS.Core.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace AMS.Core.Shared.EmailService
{
    public class EmailGenerator : IEmailGenerator
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailSender _emailSender;

        public EmailGenerator(UserManager<ApplicationUser> userManager, IEmailSender emailSender)
        {
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            _emailSender = emailSender ?? throw new ArgumentNullException(nameof(emailSender));
        }

        public async Task GenerateEmailConfirmationLinkAsync(ApplicationUser user)
        {
            // Send Email to Hospital Admin
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = HttpUtility.UrlEncode(token);
            var confirmationLink = $"http://localhost:5173/auth/confirm-email?userId={user.Id}&token={encodedToken}";

            await _emailSender.SendEmailAsync(
                user.Email,
                "Confirm Your Email",
                $"Please confirm your email by clicking this link: <a href='{confirmationLink}'>Confirm Email</a>"
                );
        }
    }
}
