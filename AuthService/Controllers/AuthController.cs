using Microsoft.AspNetCore.Mvc;
using AuthService.Models;
using AuthService.Services;
using System.Text.Json;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly TokenService _tokenService;
        private readonly RabbitMQService _rabbitMQService;

        public AuthController(TokenService tokenService, RabbitMQService rabbitMQService)
        {
            _tokenService = tokenService;
            _rabbitMQService = rabbitMQService;
        }

       [HttpPost("login")]
public IActionResult Login([FromBody] LoginRequest request)
{
    var message = JsonSerializer.Serialize(request);

    // Usar método que envia a mensagem e aguarda a resposta com correlationId
    var response = _rabbitMQService.SendAndReceive("auth.login", message, TimeSpan.FromSeconds(10));

    if (string.IsNullOrEmpty(response))
    {
        return StatusCode(500, "No response from user management service.");
    }

    var responseObject = JsonSerializer.Deserialize<JsonElement>(response);

    if (!responseObject.TryGetProperty("Status", out var status) || status.GetString() != "Success")
    {
        return Unauthorized("Invalid credentials.");
    }

    if (!responseObject.TryGetProperty("User", out var user) || user.ValueKind == JsonValueKind.Null)
    {
        return Unauthorized("User not found.");
    }

    int userId = user.GetProperty("Id").GetInt32();
    string username = user.GetProperty("Username").GetString();

    var token = _tokenService.GenerateToken(userId, username ?? "");

    return Ok(new
    {
        Token = token,
        User = user
    });
}

    }
}
