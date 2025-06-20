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

        // GET: api/users?page=1&pageSize=10&search=admin
        [HttpGet]
        public async Task<IActionResult> GetUsers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            try
            {
                var result = await _repository.GetUsersPaginatedAsync(page, pageSize, search);
                return Ok(result);
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

        // GET: api/users/5
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

        // GET: api/users/email?test@gmail.com
        [HttpGet("email")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUserByEmail([FromQuery] string email)
        {
            var user = await _repository.GetUserIdByEmailAsync(email);
            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }
            return Ok(user);
        }

        // POST: api/users
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> AddUser([FromBody] User user)
        {
            var existingUser = await _repository.GetUserByUsernameAsync(user.Username);
            var existingEmail = await _repository.GetUserIdByEmailAsync(user.Email);
            if (existingUser != null)
            {
                return Conflict(new { Message = "User already exists." });
            }
            if (existingEmail != null)
            {
                return Conflict(new { Message = "Email already exists." });
            }

            await _repository.AddUserAsync(user);
            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }

        // PATCH: api/users/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdate user)
        {
            try
            {
                await _repository.UpdateUserByIdAsync(id, user);
                return Ok("User updated successfully.");
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { Message = "User not found." });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Failed to update user.", Details = ex.Message });
            }
        }

        // DELETE: api/users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var existingUser = await _repository.GetUserByIdAsync(id);
            if (existingUser == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            await _repository.DeleteUserAsync(id);
            return Ok("User deleted successfully.");
        }
    }
}
