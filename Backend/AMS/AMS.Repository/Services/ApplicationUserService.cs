using AMS.Core.Entities;
using AMS.Core.Shared.DTOs;
using AMS.Core.Shared.Interfaces;
using AMS.Repository.Repository.IRepository;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Services
{
    public class ApplicationUserService : IApplicationUserService
    {
        private readonly IUnitofWork _unitofWork;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;

        public ApplicationUserService(IUnitofWork unitofWork, IMapper mapper, UserManager<ApplicationUser> userManager)
        {
            _unitofWork = unitofWork;
            _mapper = mapper;
            _userManager = userManager;
        }

        // Get User By Id
        public async Task<ApplicationUserDto> GetByIdAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            return _mapper.Map<ApplicationUserDto>(user);
        }

        // Get User By Email
        public async Task<ApplicationUserDto> GetUserByEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            return _mapper.Map<ApplicationUserDto>(user);
        }

        //Get Hospital Admin
        public async Task<ApplicationUserDto> GetHospitalAdminAsync(Guid hospitalId)
        {
            var user = await _unitofWork.ApplicationUser.GetHospitalAdminAsync(hospitalId);

            return _mapper.Map<ApplicationUserDto>(user);
        }


        // Get Users by hospital
        public async Task<IEnumerable<ApplicationUserDto>> GetUserByHospitalIdAsync(Guid hospitalId)
        {
            var users = await _unitofWork.ApplicationUser.GetUserByHospitalIdAsync(hospitalId);

            return _mapper.Map<IEnumerable<ApplicationUserDto>>(users);
        }

        // Get Users By Name
        public async Task<IEnumerable<ApplicationUserDto>> GetUsersByNameAsync(string name)
        {
            var users = await _unitofWork.ApplicationUser.GetUsersByNameAsync(name);

            return _mapper.Map<IEnumerable<ApplicationUserDto>>(users);
        }

        // Update User
        public async Task UpdateUserAsync(string userId, RegisterDto registerDto)
        {
            var user = _mapper.Map<ApplicationUser>(registerDto);

            await _unitofWork.ApplicationUser.UpdateUserAsync(userId, user);
            await _unitofWork.SaveAsync();
        }
    }
}
