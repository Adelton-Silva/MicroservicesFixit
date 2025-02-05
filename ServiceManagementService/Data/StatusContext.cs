using ServiceManagementService.Models;
using Microsoft.EntityFrameworkCore;

namespace ServiceManagementService.Data;

public class StatusContext : DbContext
{
   public StatusContext(DbContextOptions<StatusContext> options) : base(options)
    {
    }

    public DbSet<Status> Statuss { get; set; }
}

