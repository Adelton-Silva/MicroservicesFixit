using Microsoft.EntityFrameworkCore;
using UserManagementService.Models;

namespace UserManagementService.Config
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
    }
}
