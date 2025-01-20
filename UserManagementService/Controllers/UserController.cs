/*using Microsoft.AspNetCore.Mvc;
using UserManagementService.Models;
using UserManagementService.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace UserManagementService.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly UserRepository _repository;

        public UserController(UserRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult GetUsers() => Ok(_repository.GetAllUsersAsync());

        [HttpPost]
        public IActionResult AddUser([FromBody] User user)
        {
            // Verificar se o usuário já existe
            var existingUser = _repository.GetUserByUsernameAsync(user.Username);
            if (existingUser != null)
            {
                return Conflict(new { Message = "User already exists." });
            }

            // Adicionar o usuário, pois ele não existe
            _repository.AddUserAsync(user);
            return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] User user)
        {
            if (id.ToString() != user.Id) return BadRequest();
            _repository.UpdateUserAsync(user);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            _repository.DeleteUserAsync(id.ToString());
            return NoContent();
        }
    }
}
*/

using Microsoft.AspNetCore.Mvc;
using UserManagementService.Models;
using UserManagementService.Repositories;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Bson;

namespace UserManagementService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly UserRepository _repository;

        public UserController(UserRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repository.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] User user)
        {
            // Verificar se o usuário já existe
            var existingUser = await _repository.GetUserByUsernameAsync(user.Username);
            if (existingUser != null)
            {
                return Conflict(new { Message = "User already exists." });
            }

            // Adicionar o usuário, pois ele não existe
            await _repository.AddUserAsync(user);
            return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
        }

        [HttpPut("{username}")]
        public async Task<IActionResult> UpdateUser(string username, [FromBody] User user)
        {
            // Verificar se o username na URL corresponde ao username do usuário enviado no corpo
            if (username != user.Username)
            {
                return BadRequest(new { Message = "Username mismatch." });
            }

            // Buscar o usuário existente pelo username
            var existingUser = await _repository.GetUserByUsernameAsync(user.Username);
            if (existingUser == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            // Atualizar o usuário
            await _repository.UpdateUserByUsernameAsync(user.Username, user);
            return NoContent();
        }


        [HttpDelete("{username}")]
        public async Task<IActionResult> DeleteUser(string username)
        {
            // Verificar se o usuário existe
            var existingUser = await _repository.GetUserByUsernameAsync(username);
            if (existingUser == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            // Deletar o usuário
            await _repository.DeleteUserAsync(username);
            return NoContent();  // Retorna sucesso
        }

    }
}
