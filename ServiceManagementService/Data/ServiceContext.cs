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
        public DbSet<Appointment> Appointments { get; set; }

        // Corrected DbSet names - assuming your model classes are named 'Parts' and 'Status'
        public DbSet<Parts> Parts { get; set; }
        public DbSet<Status> Statuses { get; set; }

        public DbSet<Company> Companies { get; set; }
        public DbSet<Machine> Machines { get; set; }

        // REMOVE THE DUPLICATE OnModelCreating METHOD ENTIRELY
        // AND COMBINE ITS CONTENTS INTO THE ONE BELOW.

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // IMPORTANT: Always call the base implementation first.
            base.OnModelCreating(modelBuilder);

            // Configuration for Company
            modelBuilder.Entity<Service>()
                .HasOne(s => s.Company)
                .WithMany()
                .HasForeignKey(s => s.CompanyId)
                .IsRequired(false);

            // Configuration for Machine (moved from the duplicate OnModelCreating)
            modelBuilder.Entity<Service>()
                .HasOne(s => s.Machine)
                .WithMany() // Consider if WithMany() is correct for a single Machine navigation property.
                            // If a Service has only one Machine, it might be .WithOne() from Machine side.
                            // If a Service can have *multiple* Machines, then your 'MachineId' in Service
                            // model should be `List<int>?` and 'Machine' navigation property should be `ICollection<Machine>?`.
                            // For now, assuming it's a single Machine relation as per your current model definition (though you mentioned 'MachineId' as a new source of array error)
                .HasForeignKey(s => s.MachineId)
                .IsRequired(false);

            // Add any other model configurations here that you might have for other entities
            // For example:
            // modelBuilder.Entity<Service>()
            //     .HasOne(s => s.Status)
            //     .WithMany()
            //     .HasForeignKey(s => s.StatusId)
            //     .IsRequired(false);

            // modelBuilder.Entity<Service>()
            //     .HasMany(s => s.Parts) // If parts_id in DB is integer[] and you want to load multiple Parts
            //     .WithMany(); // Or specify a join table with .UsingEntity(...)
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Server=localhost;Port=5432;Database=ServiceManagement;User Id=postgres;Password=postgres;");
            }
        }
    }
}