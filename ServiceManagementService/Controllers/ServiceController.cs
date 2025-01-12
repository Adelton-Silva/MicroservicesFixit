using Microsoft.AspNetCore.Mvc;
using ServiceManagementService.Data;

using Microsoft.AspNetCore.Authorization;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ServiceController : ControllerBase
{
    private readonly AppDbContext _context;

    public ServiceController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("createService")]
    public async Task<IActionResult> CreateService([FromBody] ServiceRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.Name))
        {
            return BadRequest("Invalid service request.");
        }

        var service = new Service
        {
            Name = request.Name,
            Description = request.Description
        };

        _context.Services.Add(service);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Service created successfully.", service });
    }
}

public class ServiceRequest
{
    public string Name { get; set; }
    public string Description { get; set; }
}
