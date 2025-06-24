using AMS.Core.Shared.DTOs;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AMS.Core.Entities;
using Microsoft.EntityFrameworkCore.Design;

namespace AMS.Core.Shared.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
            CreateMap<ApplicationUser, RegisterDto>().ReverseMap();
            CreateMap<ApplicationUser, ApplicationUserDto>().ReverseMap();

            CreateMap<Hospital, HospitalDto>().ReverseMap();
            CreateMap<Hospital, CreateHospitalDto>().ReverseMap();

            CreateMap<Category, CategoryDto>().ReverseMap();
            CreateMap<Category, CreateCategoryDto>().ReverseMap();

            CreateMap<Appointment, AppointmentDto>().ReverseMap();
            CreateMap<Appointment, CreateAppointmentDto>().ReverseMap();
            CreateMap<Appointment, GetAppointmentDto>()
                .ForMember(dest => dest.ApplicationUserName, opt => opt.MapFrom(src => src.ApplicationUser.FullName))
                .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => src.Doctor.ApplicationUser.FullName))
                .ReverseMap();

            CreateMap<Doctor, DoctorDto>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.ApplicationUser.FullName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.ApplicationUser.Email))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.ApplicationUser.PhoneNumber))
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.ApplicationUser.DateOfBirth))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ApplicationUser.ImageUrl))
                .ForMember(dest => dest.HospitalIds, opt => opt.MapFrom(src => src.Hospitals.Select(dh => dh.HospitalId).ToList()))
                .ReverseMap();

            CreateMap<Doctor, UpdateDoctorDto>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.ApplicationUser.FullName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.ApplicationUser.Email))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.ApplicationUser.PhoneNumber))
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.ApplicationUser.DateOfBirth))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ApplicationUser.ImageUrl))
                .ReverseMap();

            CreateMap<Doctor, CreateDoctorDto>().ReverseMap();

            CreateMap<DoctorHospital, DoctorHospitalDto>()
                .ForMember(dest => dest.category, opt => opt.MapFrom(src => src.Doctor.Category))
                .ReverseMap();

            CreateMap<CategoryHospital, CategoryHospitalDto>().ReverseMap();

            CreateMap<Review, CreateReviewDto>().ReverseMap();
            CreateMap<Review, ReviewDto>()
                .ForMember(dest => dest.UserFullName, opt => opt.MapFrom(src => src.ApplicationUser.FullName))
                .ForMember(dest => dest.DoctorReply, opt => opt.MapFrom(src => src.DoctorReply != null ? src.DoctorReply.Message : null))
                .ForMember(dest => dest.HospitalReply, opt => opt.MapFrom(src => src.HospitalReply != null ? src.HospitalReply.Message : null))
                .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => src.Appointment.Doctor.ApplicationUser.FullName))
                .ForMember(dest => dest.HospitalName, opt => opt.MapFrom(src => src.Appointment.Hospital.Name));
            CreateMap<ReviewDto, Review>();
        }
    }
}
