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
[Route("api/review")]
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
    public async Task<ActionResult<IEnumerable<Review>>> GetReview(
    [FromQuery] string? review_text,
    [FromQuery] int? service_id,
    [FromQuery] int? client_id,
    [FromQuery] int? review_star,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10
    )
    {
        if (page <= 0 || pageSize <= 0)
        {
            return BadRequest(new { Message = "Page and pageSize must be greater than 0." });
        }

        var query = _context.Reviews.AsQueryable();

        if (!string.IsNullOrEmpty(review_text))
        {
            query = query.Where(a => a.Review_text != null && a.Review_text.Contains(review_text));
        }
        if (service_id.HasValue)
        {
            query = query.Where(a => a.Service_id == service_id.Value);
        }
        if (client_id.HasValue)
        {
            query = query.Where(a => a.Client_id == client_id.Value);
        }
        if (review_star.HasValue)
        {
            query = query.Where(a => a.Review_star == review_star.Value);
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

        var reviews = await query
           .Skip((page - 1) * pageSize)
           .Take(pageSize)
           .ToListAsync();

        return Ok(reviews);
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

    // PATCH: api/reviews/5
    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchReview(int id, Review review)
    {
        var existingReview = await _context.Reviews.FindAsync(id);
        if (existingReview == null)
            return NotFound("The review does not exist.");

        if (review.Service_id.HasValue)
        {
            try
            {
                var serviceExists = _serviceContext.Services.Any(st => st.Id == review.Service_id.Value);
                if (!serviceExists)
                    return BadRequest("The service does not exist.");
                else
                    existingReview.Service_id = review.Service_id.Value;
            }catch (Exception ex)
            {
                _logger.LogError($"Erro ao verificar a existência do serviço: {ex.Message}");
                return StatusCode(500, "Internal server error while checking service existence.");
            }
        }

        if (review.Client_id.HasValue)
        {
            var validate = validateUserId(review.Client_id.Value, out var error);

            _context.Entry(review).State = EntityState.Modified;
            if (!validate)
            {
                if (error.Contains("Timeout"))
                    return StatusCode(504, error);
                else
                    return Unauthorized(error);
            }
            existingReview.Client_id = review.Client_id.Value;
        }

        if (review.Review_text != null)
            existingReview.Review_text = review.Review_text;

        if (review.Review_star.HasValue)
            existingReview.Review_star = review.Review_star.Value;

        review.Modified_date = DateTime.UtcNow;

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
    
     private bool validateUserId(int userId, out string? error)
    {
        error = null;

        var message = JsonSerializer.Serialize(new { UserId = userId });
        _rabbitMQService.SendMessage("user.validate", message);

        // Aguarda a resposta com timeout de 10 segundos
        var response = _rabbitMQService.ReceiveMessage("user.validate.response", TimeSpan.FromSeconds(10));

        if (string.IsNullOrEmpty(response))
        {
            _logger.LogError("Nenhuma resposta recebida do UserManagementService.");
            error = "Timeout: No response from user management service.";
            return false; //StatusCode(504, "Timeout: No response from user management service.");
        }

        var responseObject = JsonSerializer.Deserialize<JsonElement>(response);
        if (!responseObject.TryGetProperty("Status", out var status) || status.GetString() != "Success")
        {
            _logger.LogWarning($"User ID {userId} não encontrado no UserManagementService.");
            error = "User does not exist.";
            return false; //Unauthorized("User does not exist.");
        }

        _logger.LogInformation($"User ID {userId} validado com sucesso.");
        return true;
    }
}
