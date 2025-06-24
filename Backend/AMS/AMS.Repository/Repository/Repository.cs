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
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly AppointmentDbContext _context;
        private readonly DbSet<T> _dbSet;
        public Repository(AppointmentDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _dbSet = context.Set<T>();
        }

        public async Task AddAsync(T entity)
        {
           await _dbSet.AddAsync(entity);
        }

        public void Delete(T entity)
        {
            _dbSet.Remove(entity);
        }
    }
}
