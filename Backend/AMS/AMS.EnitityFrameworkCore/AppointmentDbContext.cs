using AMS.Core.Entities;
using AMS.Core.Enums;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace AMS.EnitityFrameworkCore
{
    public class AppointmentDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppointmentDbContext(DbContextOptions<AppointmentDbContext> options)
            : base(options)
        {}
        
        public DbSet<ApplicationUser> applicationUsers { get; set; }
        public DbSet<Appointment> appointments { get; set; }
        public DbSet<Doctor> doctors { get; set; }
        public DbSet<Category> categories { get; set; }
        public DbSet<Hospital> hospitals { get; set; }
        public DbSet<DoctorHospital> doctorHospitals { get; set; }
        public DbSet<CategoryHospital> categoryHospitals { get; set; }
        public DbSet<Review> reviews { get; set; }
        public DbSet<Reply> replies { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Doctor -> ApplicationUser
            modelBuilder.Entity<Doctor>()
                .HasOne(d => d.ApplicationUser)
                .WithOne(u => u.Doctor)
                .HasForeignKey<Doctor>(d => d.ApplicationUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Appointment -> ApplicationUser
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.ApplicationUser)
                .WithMany(u => u.Appointments)
                .HasForeignKey(a => a.ApplicationUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Hospital -> Admin
            modelBuilder.Entity<Hospital>()
                .HasOne(h => h.Admin)
                .WithMany()
                .HasForeignKey(h => h.AdminId)
                .OnDelete(DeleteBehavior.Restrict);

            // Appointment -> Doctor
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany(d => d.Appointments)
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Appointment -> Hospital
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Hospital)
                .WithMany(h => h.Appointments)
                .HasForeignKey(a => a.HospitalId)
                .OnDelete(DeleteBehavior.Restrict);

            // Doctor -> Category
            modelBuilder.Entity<Doctor>()
                .HasOne(d => d.Category)
                .WithMany(c => c.Doctors)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // DoctorHospital: many-to-many join
            modelBuilder.Entity<DoctorHospital>()
                .HasKey(dh => new { dh.DoctorId, dh.HospitalId });

            modelBuilder.Entity<DoctorHospital>()
                .HasOne(dh => dh.Doctor)
                .WithMany(d => d.Hospitals)
                .HasForeignKey(dh => dh.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DoctorHospital>()
                .HasOne(dh => dh.Hospital)
                .WithMany(h => h.Doctors)
                .HasForeignKey(dh => dh.HospitalId)
                .OnDelete(DeleteBehavior.Restrict);

            // CategoryHospital: many-to-many join
            modelBuilder.Entity<CategoryHospital>()
                .HasKey(ch => new { ch.CategoryId, ch.HospitalId });

            modelBuilder.Entity<CategoryHospital>()
                .HasOne(ch => ch.Category)
                .WithMany(c => c.Hospitals)
                .HasForeignKey(ch => ch.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CategoryHospital>()
                .HasOne(ch => ch.Hospital)
                .WithMany(h => h.Categories)
                .HasForeignKey(ch => ch.HospitalId)
                .OnDelete(DeleteBehavior.Restrict);


            // DoctorReply

            modelBuilder.Entity<Review>()
                .HasOne(r => r.DoctorReply)
                .WithOne()
                .HasForeignKey<Review>(r => r.DoctorReplyId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_DoctorReply_Review");

            // HospitalReply
            modelBuilder.Entity<Review>()
                .HasOne(r => r.HospitalReply)
                .WithOne()
                .HasForeignKey<Review>(r => r.HospitalReplyId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_HospitalReply_Review");
        }
    }
}
