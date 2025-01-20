/*using Microsoft.EntityFrameworkCore;
using UserManagementService.Models;

namespace UserManagementService.Config
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
    }
}
*/
using MongoDB.Driver;
using UserManagementService.Models;

namespace UserManagementService.Config
{
    public class UserDbContext
    {
        private readonly IMongoDatabase _database;

        public UserDbContext(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("MongoDbConnection");
            var mongoClient = new MongoClient(connectionString);
            _database = mongoClient.GetDatabase(configuration["MongoDbSettings:DatabaseName"]);
        }

        public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
    }
}

