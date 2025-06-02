using ServiceManagementService.Models;
using Microsoft.EntityFrameworkCore;

namespace ServiceManagementService.Data
{
    public class ServiceContext : DbContext
    {
        public ServiceContext(DbContextOptions<ServiceContext> options) : base(options)
        {
        }

        public DbSet<Service> Services { get; set; }
        public DbSet<Appointment> Appointments { get; set; }  // Adicionado aqui

        public DbSet<Parts> Partss { get; set; }
        public DbSet<Status> Statuss { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Service>()
                .HasOne(s => s.Appointment)
                .WithMany()
                .HasForeignKey(s => s.Appointment_id)
                .IsRequired(false);

            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Connection string para PostgreSQL
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Server=localhost;Port=5432;Database=ServiceManagement;User Id=postgres;Password=postgres;");
            }
        }
    }
}
