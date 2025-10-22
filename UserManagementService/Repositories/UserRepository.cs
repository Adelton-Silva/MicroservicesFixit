using MongoDB.Driver;
using UserManagementService.Models;
using MongoDB.Bson;
using BCrypt.Net;

namespace UserManagementService.Repositories
{
    public class UserRepository
    {
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<Counter> _counterCollection;

        public UserRepository(IMongoDatabase database)
        {
            _users = database.GetCollection<User>("Users");
            _counterCollection = database.GetCollection<Counter>("Counters");
            EnsureIndexes();
        }

        private void EnsureIndexes()
        {
            _users.Indexes.CreateOne(new CreateIndexModel<User>(
                Builders<User>.IndexKeys.Ascending(u => u.Username),
                new CreateIndexOptions { Unique = true }
            ));
        }

        public async Task<int> GetNextUserIdAsync()
        {
            var filter = Builders<Counter>.Filter.Eq(c => c.Id, ObjectId.Empty);
            var update = Builders<Counter>.Update.Inc(c => c.SequenceValue, 1);

            var counter = await _counterCollection.FindOneAndUpdateAsync(
                filter,
                update,
                new FindOneAndUpdateOptions<Counter>
                {
                    IsUpsert = true,
                    ReturnDocument = ReturnDocument.After
                });

            return counter.SequenceValue;
        }

        public async Task<List<User>> GetAllUsersAsync(int pageNumber, int pageSize)
        {
            return await _users.Find(user => true)
                .Skip((pageNumber - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();
        }

        public async Task<User?> GetUserByUsernameAsync(string username) =>
            await _users.Find(u => u.Username == username).FirstOrDefaultAsync();

        public async Task<User?> GetUserByIdAsync(int id) =>
            await _users.Find(u => u.Id == id).FirstOrDefaultAsync();

        public async Task<User?> GetUserIdByEmailAsync(string email) =>
            await _users.Find(u => u.Email == email).FirstOrDefaultAsync();

        public async Task AddUserAsync(User user)
        {
            if (await GetUserByUsernameAsync(user.Username) != null)
                throw new InvalidOperationException("Username already exists.");

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.Id = await GetNextUserIdAsync();
            await _users.InsertOneAsync(user);
        }

        public async Task UpdateUserByIdAsync(int id, UserUpdate user)
        {
            var existingUser = await GetUserByIdAsync(id);
            if (existingUser == null)
                throw new KeyNotFoundException("User not found.");

            if (!string.IsNullOrEmpty(user.Username) && user.Username != existingUser.Username)
            {
                var usernameConflict = await GetUserByUsernameAsync(user.Username);
                if (usernameConflict != null)
                    throw new InvalidOperationException("Username already exists.");
                existingUser.Username = user.Username;
            }

            if (!string.IsNullOrEmpty(user.Password) &&
                !BCrypt.Net.BCrypt.Verify(user.Password, existingUser.Password))
            {
                existingUser.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            }

            if (!string.IsNullOrEmpty(user.Email) && user.Email != existingUser.Email)
                existingUser.Email = user.Email;

            var result = await _users.ReplaceOneAsync(u => u.Id == id, existingUser);

            if (result.ModifiedCount == 0)
                throw new Exception("Failed to update user. Please try again.");
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await GetUserByIdAsync(id);
            if (user == null)
                throw new KeyNotFoundException("User not found.");

            await _users.DeleteOneAsync(u => u.Id == id);
        }

        public async Task<PagedResult<User>> GetUsersPaginatedAsync(int page, int pageSize, string? search = null)
        {
            var filter = Builders<User>.Filter.Empty;

            if (!string.IsNullOrWhiteSpace(search))
            {
                var regex = new BsonRegularExpression(search, "i");
                filter = Builders<User>.Filter.Or(
                    Builders<User>.Filter.Regex(u => u.Username, regex),
                    Builders<User>.Filter.Regex(u => u.Email, regex)
                );
            }

            var totalUsers = await _users.CountDocumentsAsync(filter);

            var users = await _users.Find(filter)
                .Skip((page - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();

            return new PagedResult<User>
            {
                Items = users,
                TotalItems = (int)totalUsers,
                Page = page,
                PageSize = pageSize
            };
        }

        // 🔑 Recuperação de Senha
        public async Task SavePasswordResetTokenAsync(int userId, string token)
        {
            var expiration = DateTime.UtcNow.AddHours(1); // Token válido por 1 hora

            var update = Builders<User>.Update
                .Set(u => u.ResetToken, token)
                .Set(u => u.ResetTokenExpiration, expiration);

            await _users.UpdateOneAsync(u => u.Id == userId, update);
        }

        public async Task<User?> GetUserByResetTokenAsync(string token)
        {
            var filter = Builders<User>.Filter.And(
                Builders<User>.Filter.Eq(u => u.ResetToken, token),
                Builders<User>.Filter.Gt(u => u.ResetTokenExpiration, DateTime.UtcNow)
            );

            return await _users.Find(filter).FirstOrDefaultAsync();
        }

        public async Task UpdatePasswordAsync(int userId, string newPassword)
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(newPassword);

            var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
            var update = Builders<User>.Update.Set(u => u.Password, hashedPassword);

            await _users.UpdateOneAsync(filter, update);
        }

        public async Task RemovePasswordResetTokenAsync(string token)
        {
            var update = Builders<User>.Update
                .Unset(u => u.ResetToken)
                .Unset(u => u.ResetTokenExpiration);

            await _users.UpdateOneAsync(u => u.ResetToken == token, update);
        }
        public async Task<int?> GetUserIdByResetTokenAsync(string token)
        {
            var user = await GetUserByResetTokenAsync(token);
            return user?.Id;
        }

    }
}
