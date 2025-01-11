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
            // Enviar solicitação ao UserManagementService
            var message = JsonSerializer.Serialize(request);
            _rabbitMQService.SendMessage("auth.login", message);

            // Receber resposta da fila de validação
            var response = _rabbitMQService.ReceiveMessage("auth.login.response");
            
            if (response == "Success")
            {
                var token = _tokenService.GenerateToken(request.Username);
                return Ok(new { Token = token });
            }

            return Unauthorized("Invalid credentials.");
        }
    }
}
