using ServiceManagementService.Data;
using ServiceManagementService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http;
using System.Text.Json; // <--- FIX 1: Add this using directive for JsonSerializer
// Make sure you have using ServiceManagementService.Models; at the top
// if WorkerDto and ServiceResponseDto are in that namespace.
// If you created a 'Dtos' folder and namespace, use 'using ServiceManagementService.Dtos;'

namespace csharp_crud_api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ServiceController : ControllerBase
{
    private readonly ServiceContext _context;
    private readonly AppointmentContext _appointmentContext;
    private readonly PartsContext _partsContext;
    
    private readonly HttpClient _httpClient;

    public ServiceController(
        ServiceContext context,
        AppointmentContext appointmentContext,
        PartsContext partsContext,
        HttpClient httpClient)
    {
        _context = context;
        _appointmentContext = appointmentContext;
        _partsContext = partsContext;
        _httpClient = httpClient;

        // FIX 6: Set BaseAddress to the root of the other service.
        // The "api/users/" part should be in the GetAsync call.
        _httpClient.BaseAddress = new Uri("http://localhost:5001/"); 
    }

  
    private async Task<WorkerDto?> GetWorkerDetails(int id)
    {
        try
        {
            Console.WriteLine($"DEBUG: Attempting to fetch worker details for ID: {id}");
            string requestUrl = $"api/users/{id}"; // This was the line that was missing/misplaced

            Console.WriteLine($"DEBUG: Full request URL: {_httpClient.BaseAddress}{requestUrl}"); // This line now works

            var response = await _httpClient.GetAsync(requestUrl); // Use requestUrl here

            Console.WriteLine($"DEBUG: Full request URL: {_httpClient.BaseAddress}{requestUrl}");


            var json = await response.Content.ReadAsStringAsync(); 
            var worker = JsonSerializer.Deserialize<WorkerDto>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            return worker;
        }
        catch (HttpRequestException ex) // FIX 3: Correct variable name for the exception
        {
            Console.WriteLine($"Error getting user with id {id}: {ex.Message}"); 
            return null; // Return null if an error occurs
        }
    }

    // GET: api/services/
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceResponseDto>>> GetService( // Changed return type to ServiceResponseDto
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

        var query = _context.Services
            .Include(s => s.Appointment)
            .Include(s => s.Parts)
            .Include(s => s.Status)
            .AsQueryable();

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

        var serviceDtos = new List<ServiceResponseDto>();
        foreach (var service in services)
        {
            WorkerDto? workerDetails = null;
            if (service.Worker_id.HasValue)
            {
                // FIX 4: Call GetWorkerDetails (the correct helper method name)
                workerDetails = await GetWorkerDetails(service.Worker_id.Value); 
            }

            serviceDtos.Add(new ServiceResponseDto
            {
                Id = service.Id,
                Appointment_id = service.Appointment_id,
                Worker_id = service.Worker_id, // FIX 5: Changed from service.user_id to service.Worker_id
                WorkerName = workerDetails?.Name, // FIX 5: Changed from service.user_id to service.Worker_id
                Parts_id = service.Parts_id,
                Date_started = service.Date_started,
                Date_finished = service.Date_finished,
                Motive_rescheduled = service.Motive_rescheduled,
                Status_id = service.Status_id,
                StatusName = service.Status?.Description, 
                Client_signature = service.Client_signature,
                Created_date = service.Created_date,
                Modified_date = service.Modified_date,
                Appointment = service.Appointment,
                Parts = service.Parts
            });
        }    

        return Ok(new
        {
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages,
            Data = serviceDtos
        });
    }

    // GET: api/services/5
    [HttpGet("{id}")]
    // FIX 7: Changed return type to ServiceResponseDto
    public async Task<ActionResult<ServiceResponseDto>> GetServive(int id) 
    {
        var service = await _context.Services.FindAsync(id);

        if (service == null)
        {
            return NotFound();
        }

        WorkerDto? workerDetails = null;
        if (service.Worker_id.HasValue)
        {
            // FIX 4: Call GetWorkerDetails (the correct helper method name)
            workerDetails = await GetWorkerDetails(service.Worker_id.Value);
        }

        // Return a ServiceResponseDto instead of raw Service model
        return Ok(new ServiceResponseDto
        {
            Id = service.Id,
            Appointment_id = service.Appointment_id,
            Worker_id = service.Worker_id,
            WorkerName = workerDetails?.Name,
            Parts_id = service.Parts_id,
            Date_started = service.Date_started,
            Date_finished = service.Date_finished,
            Motive_rescheduled = service.Motive_rescheduled,
            Status_id = service.Status_id,
            StatusName = service.Status?.Description,
            Client_signature = service.Client_signature,
            Created_date = service.Created_date,
            Modified_date = service.Modified_date,
            // Include related local entities if needed in the DTO
            Appointment = service.Appointment,
            Parts = service.Parts
        });
    }

    // POST: api/services
    [HttpPost]
    public async Task<ActionResult<Service>> PostService(Service service)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var appointmentExists = await _appointmentContext.Appointments.AnyAsync(st => st.Id == service.Appointment_id);
        if (!appointmentExists)
        {
            return BadRequest("The appointment does not exist.");
        }

        var partsExists = await _partsContext.Partss.AnyAsync(m => m.Id == service.Parts_id);
        if (!partsExists)
        {
            return BadRequest("The parts does not exist.");
        }

        // Validação para Worker_id (relação externa)
        if (service.Worker_id.HasValue)
        {
            // FIX 4: Call GetWorkerDetails (the correct helper method name)
            var workerDetails = await GetWorkerDetails(service.Worker_id.Value);
            if (workerDetails == null)
            {
                return BadRequest("The worker does not exist or is unavailable.");
            }
        }

        var utcNow = DateTime.UtcNow;
        service.Created_date = utcNow;
        service.Modified_date = utcNow;

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

        var appointmentExists = await _appointmentContext.Appointments.AnyAsync(st => st.Id == service.Appointment_id);
        if (!appointmentExists)
        {
            return BadRequest("The appointment does not exist.");
        }

        var partsExists = await _partsContext.Partss.AnyAsync(m => m.Id == service.Parts_id);
        if (!partsExists)
        {
            return BadRequest("The parts does not exist.");
        }

        // Validação para Worker_id (relação externa)
        if (service.Worker_id.HasValue)
        {
            // FIX 4: Call GetWorkerDetails (the correct helper method name)
            var workerDetails = await GetWorkerDetails(service.Worker_id.Value);
            if (workerDetails == null)
            {
                return BadRequest("The worker does not exist or is unavailable.");
            }
        }

        service.Modified_date = DateTime.UtcNow;

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