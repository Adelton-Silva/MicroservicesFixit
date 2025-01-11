using Microsoft.AspNetCore.Mvc;
using UserManagementService.Models;
using UserManagementService.Repositories;

namespace UserManagementService.Controllers
{
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
