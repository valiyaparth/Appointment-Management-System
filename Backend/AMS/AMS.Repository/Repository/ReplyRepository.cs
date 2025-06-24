using AMS.Core.Entities;
using AMS.EnitityFrameworkCore;
using AMS.Repository.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Repository
{
    public class ReplyRepository : Repository<Reply>, IReplyRepository
    {
        private readonly AppointmentDbContext _context;
        public ReplyRepository(AppointmentDbContext context) : base(context)
        {
            _context = context;
        }
    }
}
