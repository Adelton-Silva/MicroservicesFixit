using ServiceManagementService.Models;
using Microsoft.EntityFrameworkCore;

namespace ServiceManagementService.Data;

public class Machine_typeContext : DbContext
{
   public Machine_typeContext(DbContextOptions<Machine_typeContext> options) : base(options)
    {
    }

    public DbSet<Machine_type> Machine_types { get; set; }
}

