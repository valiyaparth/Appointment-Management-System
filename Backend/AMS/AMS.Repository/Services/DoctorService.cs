using AMS.Core.Entities;
using AMS.Core.Shared.DTOs;
using AMS.Core.Shared.EmailService;
using AMS.Core.Shared.Interfaces;
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
    public class DoctorService : IDoctorService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUnitofWork _unitofWork;
        private readonly IMapper _mapper;
        private readonly IEmailGenerator _emailGenerator;

        public DoctorService(IUnitofWork unitofWork, IMapper mapper, 
                            UserManager<ApplicationUser> userManager, IEmailGenerator emailGenerator)
        {
            _unitofWork = unitofWork;
            _mapper = mapper;
            _userManager = userManager;
            _emailGenerator = emailGenerator;
        }

        // Add Doctor
        public async Task<DoctorDto> AddDoctorAsync(CreateDoctorDto createDoctorDto)
        {
            // Check if Doctor already exists
            var user = await _userManager.FindByEmailAsync(createDoctorDto.Email);


            // If not, create a new ApplicationUser and Doctor
            if (user == null || user.DoctorId == null)
            {
                // Begin Transaction 
                using var transaction = await _unitofWork.BeginTransactionAsync();

                try
                {
                    if (user == null)
                    {   // Create ApplicationUser for Doctor
                        user = new ApplicationUser
                        {
                            FullName = createDoctorDto.FullName,
                            Email = createDoctorDto.Email,
                            UserName = createDoctorDto.Email,
                            PhoneNumber = createDoctorDto.PhoneNumber,
                            DateOfBirth = createDoctorDto.DateOfBirth
                        };

                        var result = await _userManager.CreateAsync(user);
                        if (!result.Succeeded)
                            throw new ApplicationException("Failed to create user: " + string.Join(", ", result.Errors.Select(e => e.Description)));
                    }
                    // Assign Doctor Role
                    await _userManager.AddToRoleAsync(user, "Doctor");

                    // Create Doctor Entity
                    var doctor = new Doctor
                    {
                        Id = Guid.NewGuid(),
                        Experience = createDoctorDto.Experience,
                        Degree = createDoctorDto.Degree,
                        Description = createDoctorDto.Description,
                        AvgTimePerPatient = createDoctorDto.AvgTimePerPatient,
                        ApplicationUserId = user.Id,
                        CategoryId = createDoctorDto.CategoryId
                    };
                    await _unitofWork.Doctor.AddAsync(doctor);

                    // Create DoctorHospital mapping
                    var doctorHospital = new DoctorHospital
                    {
                        DoctorId = doctor.Id,
                        HospitalId = createDoctorDto.HospitalId
                    };

                    await _unitofWork.Doctor.AddDoctorToHospitalAsync(doctorHospital);

                    // Save all changes here
                    await _unitofWork.SaveAsync();

                    // Map Hospital Id to the user table
                    user.DoctorId = doctor.Id;
                    await _userManager.UpdateAsync(user);

                    // Send Email to doctor
                    await _emailGenerator.GenerateEmailConfirmationLinkAsync(user);

                    // Commit transaction
                    await transaction.CommitAsync();
                    return _mapper.Map<DoctorDto>(doctor);
                }
                catch(Exception)
                {
                    // Rollback transaction in case of error
                    await transaction.RollbackAsync();
                    throw;
                }
            }
            else
            {
                var hospitals = await _unitofWork.Hospital.GetHospitalsByDoctorIdAsync(user.DoctorId);
                var existingHospital = hospitals.Any(h => h.Id == createDoctorDto.HospitalId);
                if (!existingHospital)
                {
                    var doctorHospital = new DoctorHospital
                    {
                        DoctorId = user.Doctor.Id,
                        HospitalId = createDoctorDto.HospitalId
                    };

                    await _unitofWork.Doctor.AddDoctorToHospitalAsync(doctorHospital);


                    await _unitofWork.SaveAsync();

                    var doctor = await _unitofWork.Doctor.GetDoctorByIdAsync(user.Doctor.Id);
                    return _mapper.Map<DoctorDto>(doctor);
                }
                else
                {
                    throw new ArgumentException($"Doctor already assigned to this hospital.");
                }
            }
            
        }


        // Get All Doctors
        public async Task<IEnumerable<DoctorDto>> GetAllDoctorsAsync()
        {
            await _unitofWork.Doctor.UpdateAllDoctorsAvgRatingAsync();

            var doctors = await _unitofWork.Doctor.GetAllDoctorsAsync();

            return _mapper.Map<IEnumerable<DoctorDto>>(doctors);
        }


        // Get Doctor by Id
        public async Task<DoctorDto> GetDoctorByIdAsync(Guid doctorId)
        {
            await _unitofWork.Doctor.CalculateAvgRatingAsync(doctorId);

            var docror = await _unitofWork.Doctor.GetDoctorByIdAsync(doctorId);

            return _mapper.Map<DoctorDto>(docror);
        }


        // Get Doctors by Category Id
        public async Task<IEnumerable<DoctorDto>> GetDoctorsByCategoryAsync(Guid categoryId)
        {
            await _unitofWork.Doctor.UpdateAllDoctorsAvgRatingAsync();

            var doctors = await _unitofWork.Doctor.GetDoctorsByCategoryAsync(categoryId);

            return _mapper.Map<IEnumerable<DoctorDto>>(doctors);
        }


        // Get Doctors by Hospital Id
        public async Task<IEnumerable<DoctorDto>> GetDoctorsByHospitalIdAsync(Guid hospitalId)
        {
            await _unitofWork.Doctor.UpdateAllDoctorsAvgRatingAsync();

            var doctors = await _unitofWork.Doctor.GetDoctorsByHospitalIdAsync(hospitalId);

            return _mapper.Map<IEnumerable<DoctorDto>>(doctors);
        }


        // Get Doctors by Name
        public async Task<IEnumerable<DoctorDto>> GetDoctorsByNameAsync(string name)
        {
            var doctors = await _unitofWork.Doctor.GetDoctorsByNameAsync(name);

            return _mapper.Map<IEnumerable<DoctorDto>>(doctors);
        }

        // Update Doctor
        public async Task UpdateDoctorAsync(Guid id, UpdateDoctorDto updateDoctorDto)
        {
            // fetch doctor
            var doctor = await _unitofWork.Doctor.GetDoctorByIdAsync(id);

            if (doctor == null)
                throw new Exception("Doctor not found");


            // get applicationuser from doctor
            var user = await _userManager.FindByIdAsync(doctor.ApplicationUserId);

            if (user == null)
                throw new Exception("User not found");


            // map doctordto to doctor
            _mapper.Map(updateDoctorDto, doctor);

            // update applicationuser specific fields
            user.FullName = updateDoctorDto.FullName;
            user.Email = updateDoctorDto.Email;
            user.PhoneNumber = updateDoctorDto.PhoneNumber;
            user.DateOfBirth = updateDoctorDto.DateOfBirth;
            user.ImageUrl = updateDoctorDto.ImageUrl;

            // update doctor specific fields
            await _unitofWork.Doctor.UpdateDoctorAsync(doctor);

            // update application user fields
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
                throw new Exception("Failed to update user: " + string.Join(", ", result.Errors.Select(e => e.Description)));

            await _unitofWork.SaveAsync();
        }


        // Get Doctor Schedule
        public async Task<IEnumerable<DoctorHospitalDto>> GetDoctorScheduleAsync(Guid hospitalId)
        {
            // Get Doctor Hospital Schedule
            var doctorHospitals = await _unitofWork.Doctor.GetDoctorScheduleAsync(hospitalId);
            if (doctorHospitals == null || !doctorHospitals.Any())
            {
                return null;
            }
            return _mapper.Map<IEnumerable<DoctorHospitalDto>>(doctorHospitals);
        }

        // Get Doctor Schedule by Doctor Id
        public async Task<IEnumerable<DoctorHospitalDto>> GetDoctorScheduleByDoctorIdAsync(Guid doctorId)
        {
            var doctorHospitals = await _unitofWork.Doctor.GetDoctorScheduleByDoctorIdAsync(doctorId);
            if (doctorHospitals == null || !doctorHospitals.Any())
            {
                return null;
            }
            return _mapper.Map<IEnumerable<DoctorHospitalDto>>(doctorHospitals);
        }

        // Update Doctor Schedule
        public async Task UpdateDoctorScheduleAsync(DoctorHospitalDto doctorHospitalDto)
        {
            var doctorHospital = _mapper.Map<DoctorHospital>(doctorHospitalDto);

            await _unitofWork.Doctor.UpdateDoctorScheduleAsync(doctorHospital);

            await _unitofWork.SaveAsync();
        }

        // Remove Doctor
        public async Task RemoveDoctorAsync(Guid hospitalId, Guid doctorId)
        {
            // Get Current Doctor
            var doctor = await _unitofWork.Doctor.GetDoctorByIdAsync(doctorId);
            if (doctor == null)
            {
                throw new KeyNotFoundException($"Doctor with id {doctorId} not found.");
            }

            // Get All hospitals associated with current doctor
            var hospitals = await _unitofWork.Hospital.GetHospitalsByDoctorIdAsync(doctorId);
            if (hospitals == null || !hospitals.Any())
            {
                throw new KeyNotFoundException($"No hospitals found for doctor with id {doctorId}.");
            }

            await _unitofWork.Doctor.RemoveDoctorAsync(doctorId, hospitalId);
            await _unitofWork.SaveAsync();
        }
    
        
        // Get TimeSlots of Doctor 
        public async Task<IEnumerable<TimeSlotDto>> GetTimeSlotsAsync(Guid hospitalId, Guid doctorId, DateOnly date)
        {
            // Validate Existence of Hospital
            var hospital = await _unitofWork.Hospital.GetHospitalByIdAsync(hospitalId);
            if (hospital == null)
            {
                throw new KeyNotFoundException($"Hospital with id {hospitalId} not found.");
            }

            // Validate Existence of Doctor
            var doctor = await _unitofWork.Doctor.GetDoctorByIdAsync(doctorId);
            if (doctor == null)
            {
                throw new KeyNotFoundException($"Doctor with id {doctorId} not found.");
            }

            var avgTime = TimeSpan.FromMinutes(doctor.AvgTimePerPatient);
            var dayOfWeek = date.DayOfWeek;

            var schedule = await _unitofWork.Doctor.GetDoctorScheduleAsync(hospitalId, doctorId, dayOfWeek);

            var bookedSlots  = await _unitofWork.Appointment.GetBookedAppointmentSlotsAsync(hospitalId, doctorId, date);
            var slots = new List<TimeSlotDto>();

            foreach(var entry in schedule)
            {
                if (entry.StartTime == null || entry.EndTime == null)
                    continue;

                var startTime = entry.StartTime.Value;
                var endTime = entry.EndTime.Value;

                while(startTime.Add(avgTime) <= endTime)
                {
                    slots.Add(new TimeSlotDto
                    {
                        StartTime = startTime,
                        IsBooked = bookedSlots.Contains(startTime)
                    });

                    startTime = startTime.Add(avgTime);
                }
            }
            return slots.OrderBy(s => s.StartTime).ToList();
        }
        
        // Get all Reviews of Doctor
        public async Task<IEnumerable<ReviewDto>> GetReviewsByDoctorIdAsync(Guid doctorId)
        {
            var doctor = await _unitofWork.Doctor.GetDoctorByIdAsync(doctorId);
            if (doctor == null)
            {
                throw new KeyNotFoundException($"Doctor with id {doctorId} not found.");
            }

            // Get Reviews
            var reviews = await _unitofWork.Review.GetReviewsByDoctorIdAsync(doctorId);
            return _mapper.Map<IEnumerable<ReviewDto>>(reviews);
        }
    }
}
