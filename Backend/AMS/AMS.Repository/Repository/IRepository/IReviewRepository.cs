using AMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Repository.IRepository
{
    public interface IReviewRepository : IRepository<Review>
    {
        Task<Review> GetReviewByIdAsync(Guid reviewId);
        Task<IEnumerable<Review>> GetReviewsByDoctorIdAsync(Guid doctorId);
    }
}
