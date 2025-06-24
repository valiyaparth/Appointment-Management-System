using AMS.Core.Interfaces;
using AMS.Core.Shared.Interfaces;
using AMS.Repository.Data;
using AMS.Repository.Repository.IRepository;
using AMS.Repository.Repository;
using AMS.Repository.Services;
using AMS.Core.Shared.EmailService;

namespace AMS.API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // Register Services
            services.AddScoped<IdentitySeeder>();
            services.AddScoped<IUnitofWork, UnitofWork>();
            services.AddScoped<IApplicationUserRepository, ApplicationUserRepository>();
            services.AddScoped<IAppointmentRepository, AppointmentRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IDoctorRepository, DoctorRepository>();
            services.AddScoped<IHospitalRepository, HospitalRepository>();
            services.AddScoped<IReviewRepository, ReviewRepository>();

            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IHospitalSerivce, HospitalService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IApplicationUserService, ApplicationUserService>();
            services.AddScoped<IAppointmentService, AppointmentService>();
            services.AddScoped<IDoctorService, DoctorService>();


            // Register AutoMapper
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            // Register Email Service
            services.AddTransient<IEmailSender, SendGridEmailSender>();
            services.AddTransient<IEmailGenerator, EmailGenerator>();

            return services;
        }
    }
}
