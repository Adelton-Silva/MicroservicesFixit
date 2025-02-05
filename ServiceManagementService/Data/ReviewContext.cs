using ServiceManagementService.Models;
using Microsoft.EntityFrameworkCore;

namespace ServiceManagementService.Data;

public class ReviewContext : DbContext
{
   public ReviewContext(DbContextOptions<ReviewContext> options) : base(options)
    {
    }

    public DbSet<Review> Reviews { get; set; }
}

