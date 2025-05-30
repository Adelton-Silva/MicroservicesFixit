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
            // Filtro para pegar o contador de IDs
            var filter = Builders<Counter>.Filter.Eq(c => c.Id, ObjectId.Empty);
            var update = Builders<Counter>.Update.Inc(c => c.SequenceValue, 1);  // Incrementa o contador

            // Se o contador não existir, o MongoDB cria um novo
            var counter = await _counterCollection.FindOneAndUpdateAsync(
                filter,
                update,
                new FindOneAndUpdateOptions<Counter>
                {
                    IsUpsert = true,  // Se não existir, cria um contador com valor 1
                    ReturnDocument = ReturnDocument.After  // Retorna o contador após a atualização
                });

            return counter.SequenceValue;  // Retorna o próximo ID gerado
        }

        public async Task<List<User>> GetAllUsersAsync(int pageNumber, int pageSize){
            pageNumber = pageNumber < 1 ? 1 : pageNumber;
            pageSize = pageSize < 1 ? 10 : pageSize;

            return await _users
                .Find(user => true)
                .Skip((pageNumber - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();
        }

        public async Task<User?> GetUserByUsernameAsync(string username) =>
            await _users.Find(user => user.Username == username).FirstOrDefaultAsync();

        public async Task<User?> GetUserByIdAsync(int id) =>
                    await _users.Find(user => user.Id == id).FirstOrDefaultAsync();
        public async Task AddUserAsync(User user)
        {
            if (await GetUserByUsernameAsync(user.Username) != null)
            {
                throw new InvalidOperationException("Username already exists.");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.Id = await GetNextUserIdAsync();
            await _users.InsertOneAsync(user);
        }

        public async Task UpdateUserByIdAsync(int id, UserUpdate user)
        {
            // Lookup existing user by the correct ID
            var existingUser = await _users.Find(u => u.Id == id).FirstOrDefaultAsync();

            if (existingUser == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            // Check if the username is being updated
            if (!string.IsNullOrEmpty(user.Username) && user.Username != existingUser.Username)
            {
                var usernameConflict = await _users.Find(u => u.Username == user.Username).FirstOrDefaultAsync();
                if (usernameConflict != null)
                {
                    throw new InvalidOperationException("Username already exists.");
                }

                existingUser.Username = user.Username;
            }

            // Update password if different (and hash it)
            if (!string.IsNullOrEmpty(user.Password))
            {
                if (!BCrypt.Net.BCrypt.Verify(user.Password, existingUser.Password))
                {
                    existingUser.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                }
            }

            // Update email if changed
            if (!string.IsNullOrEmpty(user.Email) && user.Email != existingUser.Email)
            {
                existingUser.Email = user.Email;
            }

            // Execute the update
            var updateResult = await _users.ReplaceOneAsync(u => u.Id == id, existingUser);

            if (updateResult.ModifiedCount == 0)
            {
                throw new Exception("Failed to update user. Please try again.");
            }
        }





        public async Task DeleteUserAsync(int id)
        {
            var user = await _users.Find(u => u.Id == id).FirstOrDefaultAsync();
            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            await _users.DeleteOneAsync(u => u.Id == id);
        }

    }
}


