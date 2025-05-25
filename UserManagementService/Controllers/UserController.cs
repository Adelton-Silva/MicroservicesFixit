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
        public async Task<IActionResult> GetUsers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            if (page <= 0 || pageSize <= 0)
            {
                return BadRequest(new { Message = "Page and pageSize must be greater than 0." });
            }

            var result = await _repository.GetUsersPaginatedAsync(page, pageSize, search);
            return Ok(result);
        }



        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingUser = await _repository.GetUserByUsernameAsync(user.Username);
            if (existingUser != null)
            {
                return Conflict(new { Message = "User already exists." });
            }

            await _repository.AddUserAsync(user);
            return CreatedAtAction(nameof(GetUsers), new { username = user.Username }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User user)
        {
            // Verificar se o username na URL corresponde ao username do usuário enviado no corpo
            if (id != user.Id)
            {
                return BadRequest(new { Message = "Username mismatch." });
            }

            // Atualizar o usuário
            await _repository.UpdateUserByIdAsync(user.Id, user);
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
