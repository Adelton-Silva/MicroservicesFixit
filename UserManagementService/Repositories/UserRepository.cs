/*using UserManagementService.Models;
using UserManagementService.Config;

using BCrypt.Net;

namespace UserManagementService.Repositories
{
    public class UserRepository
    {
        private readonly UserDbContext _context;

        public UserRepository(UserDbContext context)
        {
            _context = context;
        }

        public IEnumerable<User> GetAllUsers() => _context.Users.ToList();

        public User? GetUserByUsername(string username)
        {
            return _context.Users.FirstOrDefault(u => u.Username == username);
        }

        public void AddUser(User user)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password); 
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public void UpdateUser(User user)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public void DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
        }
    }
}

*/

using MongoDB.Driver;
using UserManagementService.Models;
using MongoDB.Bson;
using BCrypt.Net;

namespace UserManagementService.Repositories
{
    public class UserRepository
    {
        private readonly IMongoCollection<User> _users;

        public UserRepository(IMongoDatabase database)
        {
            _users = database.GetCollection<User>("Users");
            EnsureIndexes();
        }

        private void EnsureIndexes()
        {
            _users.Indexes.CreateOne(new CreateIndexModel<User>(
                Builders<User>.IndexKeys.Ascending(u => u.Username),
                new CreateIndexOptions { Unique = true }
            ));
        }

        public async Task<List<User>> GetAllUsersAsync() =>
            await _users.Find(user => true).ToListAsync();

        public async Task<User?> GetUserByUsernameAsync(string username) =>
            await _users.Find(user => user.Username == username).FirstOrDefaultAsync();

        public async Task AddUserAsync(User user)
        {
            if (await GetUserByUsernameAsync(user.Username) != null)
            {
                throw new InvalidOperationException("Username já está em uso.");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            await _users.InsertOneAsync(user);
        }

        public async Task UpdateUserByUsernameAsync(string username, User user)
        {
            // Buscar o usuário existente
            var existingUser = await _users.Find(u => u.Username == username).FirstOrDefaultAsync();
            if (existingUser == null)
            {
                throw new KeyNotFoundException("Usuário não encontrado.");
            }

            // Verificar se o username no corpo não é o mesmo
            if (!string.Equals(existingUser.Username, user.Username, StringComparison.OrdinalIgnoreCase))
            {
                var usernameConflict = await _users.Find(u => u.Username == user.Username).FirstOrDefaultAsync();
                if (usernameConflict != null)
                {
                    throw new InvalidOperationException("O username já está em uso.");
                }
            }

            // Verificar e atualizar a senha
            if (!BCrypt.Net.BCrypt.Verify(user.Password, existingUser.Password))
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            }
            else
            {
                user.Password = existingUser.Password;
            }

            // Manter o mesmo ID
            user.Id = existingUser.Id;

            // Executar a atualização
            var updateResult = await _users.ReplaceOneAsync(u => u.Username == username, user);

            // Verificar se a atualização foi bem-sucedida
            if (updateResult.ModifiedCount == 0)
            {
                throw new Exception("Falha ao atualizar o usuário. Nenhuma modificação ocorreu.");
            }
        }




        public async Task DeleteUserAsync(string username)
        {
            var user = await _users.Find(u => u.Username == username).FirstOrDefaultAsync();
            if (user == null)
            {
                throw new KeyNotFoundException("Usuário não encontrado.");
            }

            await _users.DeleteOneAsync(u => u.Username == username);
        }

    }
}
