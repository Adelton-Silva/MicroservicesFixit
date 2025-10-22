using Microsoft.AspNetCore.Mvc;
using UserManagementService.Models;
using UserManagementService.Repositories;
using Microsoft.AspNetCore.Authorization;


namespace UserManagementService.Controllers
{
    [ApiController]
    [Route("api/account")]
    public class AccountController : ControllerBase
    {
        private readonly UserRepository _repository;

        public AccountController(UserRepository repository)
        {
            _repository = repository;
        }

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _repository.GetUserIdByEmailAsync(request.Email);
            if (user == null)
            {
                return NotFound(new { Message = "Email not found." });
            }

            var resetToken = Guid.NewGuid().ToString();
            await _repository.SavePasswordResetTokenAsync(user.Id, resetToken);
            var resetLink = $"http://localhost:3000/reset-password?token={resetToken}";
            Console.WriteLine($"Reset link: {resetLink}");

            return Ok(new { Message = "Reset link sent (check server logs)." });
        }

        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var userId = await _repository.GetUserIdByResetTokenAsync(request.Token);
            if (userId == null)
            {
                return BadRequest(new { Message = "Invalid or expired token." });
            }

            await _repository.UpdatePasswordAsync(userId.Value, request.NewPassword);
            await _repository.RemovePasswordResetTokenAsync(request.Token);

            return Ok(new { Message = "Password updated successfully." });
        }
    }
}
