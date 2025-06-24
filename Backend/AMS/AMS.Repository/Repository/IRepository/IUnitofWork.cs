using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Repository.IRepository
{
    public interface IUnitofWork
    {
        IHospitalRepository Hospital { get; }
        IAppointmentRepository Appointment { get; }
        IDoctorRepository Doctor { get; }
        ICategoryRepository Category { get; }
        IApplicationUserRepository ApplicationUser { get; }
        IReviewRepository Review { get; }
        IReplyRepository Reply { get; }
        Task SaveAsync();

        Task<IDbContextTransaction> BeginTransactionAsync();
    }
}
