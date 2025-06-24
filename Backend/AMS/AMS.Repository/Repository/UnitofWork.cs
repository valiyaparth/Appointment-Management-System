using AMS.EnitityFrameworkCore;
using AMS.Repository.Repository.IRepository;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Repository
{
    public class UnitofWork : IUnitofWork
    {
        private readonly AppointmentDbContext _context;
        
        public IHospitalRepository Hospital { get; private set; }
        public IAppointmentRepository Appointment { get; private set; }
        public IDoctorRepository Doctor { get; private set; }
        public ICategoryRepository Category { get; private set; }
        public IApplicationUserRepository ApplicationUser { get; private set; }
        public IReviewRepository Review { get; private set; }
        public IReplyRepository Reply { get; private set; }

        public UnitofWork(AppointmentDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));

            Hospital = new HospitalRepository(_context);
            Appointment = new AppointmentRepository(_context);
            Doctor = new DoctorRepository(_context);
            Category = new CategoryRepository(_context);
            ApplicationUser = new ApplicationUserRepository(_context);
            Review = new ReviewRepository(_context);
            Reply = new ReplyRepository(_context);
        }

        public async Task SaveAsync()
        {
           await _context.SaveChangesAsync();
        }

        public Task<IDbContextTransaction> BeginTransactionAsync() => _context.Database.BeginTransactionAsync();
    }
}
