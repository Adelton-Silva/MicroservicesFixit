using ServiceManagementService.Models;
using Microsoft.EntityFrameworkCore;

namespace ServiceManagementService.Data;

public class PartsContext : DbContext
{
    public PartsContext(DbContextOptions<PartsContext> options) : base(options)
    {
    }

    public DbSet<Parts> Parts { get; set; } // <--- Changed from Partss to Parts
}