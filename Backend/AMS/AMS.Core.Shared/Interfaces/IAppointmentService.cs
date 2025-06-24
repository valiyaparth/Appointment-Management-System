using AMS.Core.Entities;
using AMS.Core.Shared.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AMS.Core.Shared.Interfaces
{
    public interface IAppointmentService
    {
        Task<GetAppointmentDto> GetAppointmentByIdAsync(Guid appointmentId);
        Task<IEnumerable<GetAppointmentDto>> GetAppointmentsByUserIdAsync(string userId);
        Task<IEnumerable<GetAppointmentDto>> GetAppointmentsByDoctorIdAsync(Guid doctorId);
        Task<IEnumerable<GetAppointmentDto>> GetAppointmentsByHosiptalIdAsync(Guid hosiptalId);
        Task<IEnumerable<GetAppointmentDto>> GetAppointmentsByHosiptalIdByDateAsync(Guid hosiptalId, DateOnly date);
        Task<IEnumerable<GetAppointmentDto>> GetAppointmentsByHosiptalIdByDateByDoctorAsync(Guid hospitalId, Guid doctorId, DateOnly date);
        
        Task<AppointmentDto> AddAppointmentAsync(CreateAppointmentDto createAppointmentDto);
        Task UpdateAppointmentAsync(Guid appointmentId, AppointmentDto appointmentDto);
        Task CompleteAppointmentAsync(Guid appointmentId);
        Task CancelAppointmentAsync(Guid appointmentId);

        Task SubmitReviewAsync(string userId, CreateReviewDto createReviewDto);
        Task AddReplyAsync(ReplyDto replyDto);
    }
}
