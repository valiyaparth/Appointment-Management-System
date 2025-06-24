using AMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Shared.EmailService
{
    public interface IEmailGenerator
    {
        Task GenerateEmailConfirmationLinkAsync(ApplicationUser user);
    }
}
