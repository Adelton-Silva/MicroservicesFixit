/*using Microsoft.EntityFrameworkCore;

namespace ServiceManagementService.Data;
public class CompanyContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Company> Companies { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Service>().ToTable("Companies");
    }
}*/

using Microsoft.EntityFrameworkCore;
using ServiceManagementService.Models; // Certifique-se de importar a classe Company

namespace ServiceManagementService.Data
{
    public class CompanyContext : DbContext
    {
        public CompanyContext(DbContextOptions<CompanyContext> options) : base(options) { }

        public DbSet<Company> Companies { get; set; } // Verifique se o nome da classe "Company" está correto
    }
}



