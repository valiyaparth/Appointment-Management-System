using AMS.Core.Entities;
using AMS.EnitityFrameworkCore;
using AMS.Repository.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Repository
{
    public class ReviewRepository : Repository<Review>, IReviewRepository
    {
        private readonly AppointmentDbContext _context;
        public ReviewRepository(AppointmentDbContext context) : base(context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Review> GetReviewByIdAsync(Guid reviewId)
        {
            var review = await _context.reviews
                .Include(r => r.Appointment)
                .Include(r => r.ApplicationUser)
                .Include(r => r.DoctorReply)
                .Include(r => r.HospitalReply)
                .FirstOrDefaultAsync(r => r.Id == reviewId);

            if (review == null)
                return null;

            return review;
        }

        public async Task<IEnumerable<Review>> GetReviewsByDoctorIdAsync(Guid doctorId)
        {
            var reviwes = await _context.reviews
                .Include(r => r.Appointment)
                .Include(r => r.ApplicationUser)
                .Include(r => r.DoctorReply)
                .Include(r => r.HospitalReply)
                .Where(r => r.Appointment.DoctorId == doctorId)
                .ToListAsync();

            if (reviwes == null)
                return null;

            return reviwes;
        }
    }
}
