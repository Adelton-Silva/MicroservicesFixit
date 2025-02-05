using System.Text.Json; // Para JsonSerializer e JsonElement
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using ServiceManagementService.Data;
using ServiceManagementService.Models;
using ServiceManagementService.Services; // Para RabbitMQService

namespace csharp_crud_api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly ReviewContext _context;
    private readonly ServiceContext _serviceContext;
    private readonly RabbitMQService _rabbitMQService;
        public ReviewController(ReviewContext context, ServiceContext serviceContext, RabbitMQService rabbitMQService) 
    {
        _context = context;
        _serviceContext = serviceContext;
        _rabbitMQService = rabbitMQService; 
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
            return Unauthorized("Invalid user.");
        }
         var message = JsonSerializer.Serialize(new { UserId = userId });
        _rabbitMQService.SendMessage("user.validate", message);

        var response = _rabbitMQService.ReceiveMessage("user.validate.response");

        if (string.IsNullOrEmpty(response))
        {
            return StatusCode(500, "No response from user management service.");
        }
         var responseObject = JsonSerializer.Deserialize<JsonElement>(response);
        if (!responseObject.TryGetProperty("Status", out var status) || status.GetString() != "Success")
        {
            return Unauthorized("User does not exist.");
        }

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