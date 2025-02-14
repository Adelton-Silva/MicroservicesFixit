using System.Text.Json; // Para JsonSerializer e JsonElement
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using ServiceManagementService.Data;
using ServiceManagementService.Models;
using ServiceManagementService.Services; // Para RabbitMQService

namespace ServiceManagementService.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly ReviewContext _context;
    private readonly ServiceContext _serviceContext;
    private readonly RabbitMQService _rabbitMQService;
    private readonly ILogger<ReviewController> _logger; // Logger para debug

    public ReviewController(ReviewContext context, ServiceContext serviceContext, RabbitMQService rabbitMQService, ILogger<ReviewController> logger) 
    {
        _context = context;
        _serviceContext = serviceContext;
        _rabbitMQService = rabbitMQService; 
        _logger = logger;
    }

    // GET: api/reviews/
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Review>>> GetReview()
    {
        return await _context.Reviews.ToListAsync();
    }

    private int GetUserIdFromToken()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "user_id");
        return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
    }

    // GET: api/reviews/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Review>> GetReview(int id)
    {
        var review = await _context.Reviews.FindAsync(id);

        if (review == null)
        {
            return NotFound();
        }

        return review;
    }

    // POST: api/reviews
    [HttpPost]
    public async Task<ActionResult<Service>> PostReview(Review review)
    {
        int userId = GetUserIdFromToken(); // Obtém user_id do token

        if (userId == 0)
        {
            _logger.LogWarning("Tentativa de criação de review com token inválido.");
            return Unauthorized("Invalid user.");
        }

        _logger.LogInformation($"Enviando solicitação para validar user_id {userId} via RabbitMQ.");

        // Enviar solicitação ao UserManagementService para validar o user_id
        var message = JsonSerializer.Serialize(new { UserId = userId });
        _rabbitMQService.SendMessage("user.validate", message);

        // Aguarda a resposta com timeout de 10 segundos
        var response = _rabbitMQService.ReceiveMessage("user.validate.response", TimeSpan.FromSeconds(10));

        if (string.IsNullOrEmpty(response))
        {
            _logger.LogError("Nenhuma resposta recebida do UserManagementService.");
            return StatusCode(504, "Timeout: No response from user management service.");
        }

        var responseObject = JsonSerializer.Deserialize<JsonElement>(response);
        if (!responseObject.TryGetProperty("Status", out var status) || status.GetString() != "Success")
        {
            _logger.LogWarning($"User ID {userId} não encontrado no UserManagementService.");
            return Unauthorized("User does not exist.");
        }

        _logger.LogInformation($"User ID {userId} validado com sucesso.");

        review.Client_id = userId;

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var serviceExists = _serviceContext.Services.Any(st => st.Id == review.Service_id);
        if (!serviceExists)
        {
            return BadRequest("The service does not exist.");
        }
        
        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetReview), new { id = review.Id }, review);
    }

    // PUT: api/reviews/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutReview(int id, Review review)
    {
        if (id != review.Id)
        {
            return BadRequest();
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var serviceExists = _serviceContext.Services.Any(st => st.Id == review.Service_id);
        if (!serviceExists)
        {
            return BadRequest("The service does not exist.");
        }

        _context.Entry(review).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ReviewExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/reviews/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null)
        {
            return NotFound();
        }

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ReviewExists(int id)
    {
        return _context.Reviews.Any(e => e.Id == id);
    }
}
