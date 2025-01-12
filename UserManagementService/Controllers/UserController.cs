using Microsoft.AspNetCore.Mvc;
using UserManagementService.Models;
using UserManagementService.Repositories;
using Microsoft.AspNetCore.Authorization;

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
        public IActionResult GetUsers() => Ok(_repository.GetAllUsers());

        [HttpPost]
        public IActionResult AddUser([FromBody] User user)
        {
            // Verificar se o usuário já existe
            var existingUser = _repository.GetUserByUsername(user.Username);
            if (existingUser != null)
            {
                return Conflict(new { Message = "User already exists." });
            }

            // Adicionar o usuário, pois ele não existe
            _repository.AddUser(user);
            return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] User user)
        {
            if (id != user.Id) return BadRequest();
            _repository.UpdateUser(user);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            _repository.DeleteUser(id);
            return NoContent();
        }
    }
}
