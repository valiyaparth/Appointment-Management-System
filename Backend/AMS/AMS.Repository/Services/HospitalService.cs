using AMS.Core.Entities;
using AMS.Core.Interfaces;
using AMS.Core.Shared.DTOs;
using AMS.Core.Shared.EmailService;
using AMS.Repository.Repository.IRepository;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace AMS.Repository.Services
{
    public class HospitalService : IHospitalSerivce
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUnitofWork _unitofWork;
        private readonly IMapper _mapper;
        private readonly IEmailGenerator _emailGenerator;

        public HospitalService(IUnitofWork unitofWork, IMapper mapper, 
                               UserManager<ApplicationUser> userManager,
                               IEmailGenerator emailGenerator)
        {
            _unitofWork = unitofWork;
            _mapper = mapper;
            _userManager = userManager;
            _emailGenerator = emailGenerator;
        }

        
        // Get All Hospital
        public async Task<IEnumerable<HospitalDto>> GetAllHospitalsAsync()
        {
            var hospitals = await _unitofWork.Hospital.GetAllHospitalsAsync();

            return _mapper.Map<IEnumerable<HospitalDto>>(hospitals);
        }


        // Get Hospital by Id
        public async Task<HospitalDto> GetHospitalByIdAsync(Guid hospitalId)
        {
            var hospital = await _unitofWork.Hospital.GetHospitalByIdAsync(hospitalId);

            return _mapper.Map<HospitalDto>(hospital);
        }


        // Get Hospitals by Category Id
        public async Task<IEnumerable<HospitalDto>> GetHospitalsByCategoryIdAsync(Guid categoryId)
        {
            var hospitals = await _unitofWork.Hospital.GetHospitalsByCategoryIdAsync(categoryId);

            return _mapper.Map<IEnumerable<HospitalDto>>(hospitals);
        }


        // Get Hospitals by Doctor Id
        public async Task<IEnumerable<HospitalDto>> GetHospitalsByDoctorIdAsync(Guid doctorId)
        {
            var hospitals = await _unitofWork.Hospital.GetHospitalsByDoctorIdAsync(doctorId);

            return _mapper.Map<IEnumerable<HospitalDto>>(hospitals);
        }


        // Get Hospitals By Name
        public async Task<IEnumerable<HospitalDto>> GetHospitalsByNameAsync(string name)
        {
            var hospitals = await _unitofWork.Hospital.GetHospitalsByNameAsync(name);

            return _mapper.Map<IEnumerable<HospitalDto>>(hospitals);
        }

        // Add Hospital
        public async Task<HospitalDto> AddHospitalAsync(CreateHospitalDto createHospitalDto)
        {
            // Check if user already exists
            var existingUser = await _userManager.FindByEmailAsync(createHospitalDto.Email);
            if (existingUser is not null)
                throw new ArgumentException("A user with this email already exists.");
            
            // Begin Transaction For consistency
            using var transaction = await _unitofWork.BeginTransactionAsync();

            try
            {
                // Create Hospital Admin
                var hospitalAdmin = new ApplicationUser
                {
                    Email = createHospitalDto.Email,
                    UserName = createHospitalDto.Email,
                    FullName = createHospitalDto.Name
                };

                var result = await _userManager.CreateAsync(hospitalAdmin);

                if(!result.Succeeded)
                    throw new ApplicationException("Failed to create user: " + string.Join(", ", result.Errors.Select(e => e.Description)));

                // Assign HospitalAdmin role
                await _userManager.AddToRoleAsync(hospitalAdmin, "HospitalAdmin");


                // Create New Hospital
                var hospital = _mapper.Map<Hospital>(createHospitalDto);
                hospital.Id = Guid.NewGuid();
                hospital.AdminId = hospitalAdmin.Id;

                // Add Hospital to the database
                await _unitofWork.Hospital.AddAsync(hospital);
                await _unitofWork.SaveAsync();

                // map Hospital Id to the user table
                hospitalAdmin.HospitalId = hospital.Id;
                await _userManager.UpdateAsync(hospitalAdmin);

                

                // Send Email to Hospital Admin
                await _emailGenerator.GenerateEmailConfirmationLinkAsync(hospitalAdmin);

                // Commit the transaction
                await transaction.CommitAsync();

                return _mapper.Map<HospitalDto>(hospital);
            }
            catch (Exception)
            {
                // Rollback Transaction in case of error
                await transaction.RollbackAsync();
                throw;
            }
        }

        // Update Hospital
        public async Task UpdateHospitalAsync(HospitalDto hospitalDto)
        {
            var hospital = _mapper.Map<Hospital>(hospitalDto);

            await _unitofWork.Hospital.UpdateHospitalAsync(hospital);

            await _unitofWork.SaveAsync();
        }


        // Delete Hospital
        public async Task DeactivateHospitalAsync(Guid id)
        {
            var hospital = await _unitofWork.Hospital.GetHospitalByIdAsync(id);

            if(hospital.IsActive)
                hospital.IsActive = false;

            await _unitofWork.SaveAsync();
        }
    }
}
