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
        public async Task<IActionResult> GetUsers([FromQuery] int pageNumber, [FromQuery] int pageSize)
        {
            try
            {
                var users = await _repository.GetAllUsersAsync(pageNumber, pageSize);
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "An error occurred while retrieving users.",
                    Details = ex.Message
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _repository.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }
            return Ok(user);
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
            return CreatedAtAction(nameof(GetUsers), new { username = user.Username }, user);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdate user)
        {
            await _repository.UpdateUserByIdAsync(id, user);
            return Ok("User updated successfully.");
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            // Verificar se o usuário existe
            var existingUser = await _repository.GetUserByIdAsync(id);
            if (existingUser == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            // Deletar o usuário
            await _repository.DeleteUserAsync(id);
            return Ok("User deleted successfully.");  // Retorna sucesso
        }

    }
}
