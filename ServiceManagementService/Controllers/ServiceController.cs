using ServiceManagementService.Data;
using ServiceManagementService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace csharp_crud_api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ServiceController : ControllerBase
{
    private readonly ServiceContext _context;
    private readonly AppointmentContext _appointmentContext;
    private readonly PartsContext _partsContext;
    public ServiceController(ServiceContext context, AppointmentContext appointmentContext, PartsContext partsContext) 
    {
        _context = context;
        _appointmentContext = appointmentContext;
        _partsContext = partsContext;
    }

    // GET: api/services/
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Service>>> GetService(
        [FromQuery] int? appointment_id,
        [FromQuery] int? worker_id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10
    )
    {
        if (page <= 0 || pageSize <= 0)
        {
            return BadRequest(new { Message = "Page and pageSize must be greater than 0." });
        }

        var query = _context.Services.AsQueryable();

        if (appointment_id.HasValue)
        {
            query = query.Where(a => a.Appointment_id == appointment_id.Value);
        }
        if (worker_id.HasValue)
        {
            query = query.Where(a => a.Worker_id == worker_id.Value);
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

        var services = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages,
            Data = services
        });
    }

    // GET: api/services/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Service>> GetServive(int id)
    {
        var service = await _context.Services.FindAsync(id);

        if (service == null)
        {
            return NotFound();
        }

        return service;
    }

    // POST: api/services
    [HttpPost]
    public async Task<ActionResult<Service>> PostService(Service service)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var appointmentExists = _appointmentContext.Appointments.Any(st => st.Id == service.Appointment_id);
        if (!appointmentExists)
        {
            return BadRequest("The appointment does not exist.");
        }
        var partsExists = _partsContext.Partss.Any(m => m.Id == service.Parts_id);
        if (!partsExists)
        {
            return BadRequest("The parts  does not exist.");
        }
        _context.Services.Add(service);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetService), new { id = service.Id }, service);
    }

     // PUT: api/services/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutService(int id, Service service)
    {
        
        if (id != service.Id)
        {
            return BadRequest();
        }
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var appointmentExists = _appointmentContext.Appointments.Any(st => st.Id == service.Appointment_id);
        if (!appointmentExists)
        {
            return BadRequest("The appointment does not exist.");
        }
        var partsExists = _partsContext.Partss.Any(m => m.Id == service.Parts_id);
        if (!partsExists)
        {
            return BadRequest("The parts  does not exist.");
        }

        _context.Entry(service).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ServiceExists(id))
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

    // DELETE: api/services/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteService(int id)
    {
        var service = await _context.Services.FindAsync(id);
        if (service == null)
        {
            return NotFound();
        }

        _context.Services.Remove(service);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ServiceExists(int id)
    {
        return _context.Services.Any(e => e.Id == id);
    }

}