using AMS.Core.Entities;
using AMS.Core.Enums;
using AMS.Core.Shared.DTOs;
using AMS.Core.Shared.Enums;
using AMS.Core.Shared.Interfaces;
using AMS.Repository.Repository.IRepository;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Repository.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IUnitofWork _unitofWork;
        private readonly IMapper _mapper;

        public AppointmentService(IUnitofWork unitofWork, IMapper mapper)
        {
            _unitofWork = unitofWork;
            _mapper = mapper;
        }


        // Get Appointment by Id
        public async Task<GetAppointmentDto> GetAppointmentByIdAsync(Guid appointmentId)
        {
            var appointment = await _unitofWork.Appointment.GetAppointmentByIdAsync(appointmentId);

            return _mapper.Map<GetAppointmentDto>(appointment);
        }


        // Get Appointments associated with one Doctor
        public async Task<IEnumerable<GetAppointmentDto>> GetAppointmentsByDoctorIdAsync(Guid doctorId)
        {
            var appointments = await _unitofWork.Appointment.GetAppointmentsByDoctorIdAsync(doctorId);

            return _mapper.Map<IEnumerable<GetAppointmentDto>>(appointments);
        }


        // Get Appointments associated with one hospital
        public async Task<IEnumerable<GetAppointmentDto>> GetAppointmentsByHosiptalIdAsync(Guid hosiptalId)
        {
            var appointments = await _unitofWork.Appointment.GetAppointmentsByHosiptalIdAsync(hosiptalId);

            return _mapper.Map<IEnumerable<GetAppointmentDto>>(appointments);
        }

        
        // Get Appointments associated with one Patient
        public async Task<IEnumerable<GetAppointmentDto>> GetAppointmentsByUserIdAsync(string userId)
        {
            var appointments = await _unitofWork.Appointment.GetAppointmentsByUserIdAsync(userId);

            return _mapper.Map<IEnumerable<GetAppointmentDto>>(appointments);
        }


        // Get Appointments associated with one hospital on a specific date
        public async Task<IEnumerable<GetAppointmentDto>> GetAppointmentsByHosiptalIdByDateAsync(Guid hosiptalId, DateOnly date)
        {
            var appointments = await _unitofWork.Appointment.GetAppointmentsByHosiptalIdByDateAsync(hosiptalId, date);
            return _mapper.Map<IEnumerable<GetAppointmentDto>>(appointments);
        }

        // Get Appointments associated with one hospital and one doctor on a specific date
        public async Task<IEnumerable<GetAppointmentDto>> GetAppointmentsByHosiptalIdByDateByDoctorAsync(Guid hospitalId, Guid doctorId, DateOnly date)
        {
            var appointments = await _unitofWork.Appointment.GetAppointmentSlotsAsync(hospitalId, doctorId, date);
            return _mapper.Map<IEnumerable<GetAppointmentDto>>(appointments);
        }




        // Add Appointment
        public async Task<AppointmentDto> AddAppointmentAsync(CreateAppointmentDto createAppointmentDto)
        {
            var existingAppointment = await _unitofWork.Appointment.AppointmentExist(
                createAppointmentDto.HospitalId,
                createAppointmentDto.DoctorId,
                createAppointmentDto.Date,
                createAppointmentDto.TimeSlot);

            if (existingAppointment)
            {
                return null;  
            }

            var appointment = _mapper.Map<Appointment>(createAppointmentDto);
            appointment.Id = Guid.NewGuid();
            appointment.Status = Status.Booked; // Default Status

            await _unitofWork.Appointment.AddAsync(appointment);
            await _unitofWork.SaveAsync();

            return _mapper.Map<AppointmentDto>(appointment);
        }

        
        // Update Appointment
        public async Task UpdateAppointmentAsync(Guid appointmentId, AppointmentDto appointmentDto)
        {
            var existingAppointment = await _unitofWork.Appointment.GetAppointmentByIdAsync(appointmentId);

            if (existingAppointment is null)
                throw new KeyNotFoundException($"Appointment Does not exist.");

            var appointment = _mapper.Map<Appointment>(appointmentDto);

            await _unitofWork.Appointment.UpdateAsync(appointment);

            await _unitofWork.SaveAsync();
        }


        // Complete Appointment
        public async Task CompleteAppointmentAsync(Guid appointmentId)
        {
            var existingAppointment = await _unitofWork.Appointment.GetAppointmentByIdAsync(appointmentId);

            if (existingAppointment is null)
                throw new KeyNotFoundException($"Appointment Does not exist.");

            existingAppointment.Status = Status.Completed;

            await _unitofWork.Appointment.UpdateAsync(existingAppointment);

            await _unitofWork.SaveAsync();
        }
        
        
        // Cancel Appointment
        public async Task CancelAppointmentAsync(Guid appointmentId)
        {
            var existingAppointment = await _unitofWork.Appointment.GetAppointmentByIdAsync(appointmentId);

            if (existingAppointment is null)
                throw new KeyNotFoundException($"Appointment Does not exist.");

            existingAppointment.Status = Status.Cancelled;

            await _unitofWork.Appointment.UpdateAsync(existingAppointment);

            await _unitofWork.SaveAsync();
        }

        // Add Review 
        public async Task SubmitReviewAsync(string userId, CreateReviewDto createReviewDto)
        {
            var appointment = await _unitofWork.Appointment.GetAppointmentByUserIdAsync(createReviewDto.AppointmentId, userId);

            if (appointment is null)
                throw new KeyNotFoundException("Appointment Not Found");

            if(appointment.Status != Status.Completed)
                throw new InvalidOperationException("Only completed appointments can be reviewed.");

            if (appointment.Review != null)
                throw new Exception("You have already submitted Review");

            var review = _mapper.Map<Review>(createReviewDto);
            review.ApplicationUserId = userId;

            await _unitofWork.Review.AddAsync(review);
            await _unitofWork.SaveAsync();
        }

        // Add Reply to Review for Hospital and Doctor
        public async Task AddReplyAsync(ReplyDto replyDto)
        {
            var review = await _unitofWork.Review.GetReviewByIdAsync(replyDto.ReviewId);

            if (review is null)
                throw new KeyNotFoundException("Review Not Found");

            if (replyDto.ReplyBy == ReplyType.Doctor && review.DoctorReply != null)
                throw new InvalidOperationException("Doctor has already replied to this review.");

            if(replyDto.ReplyBy == ReplyType.HospitalAdmin && review.HospitalReply != null)
                throw new InvalidOperationException("Hospital has already replied to this review.");

            var reply = new Reply
            {
                Id = Guid.NewGuid(),
                Message = replyDto.Message,
                ReplyBy = replyDto.ReplyBy
            };

            await _unitofWork.Reply.AddAsync(reply);

            if(replyDto.ReplyBy == ReplyType.Doctor)
            {
                review.DoctorReply = reply;
            }
            else if (replyDto.ReplyBy == ReplyType.HospitalAdmin)
            {
                review.HospitalReply = reply;
            }

            await _unitofWork.SaveAsync();
        }
    }
}
