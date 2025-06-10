using ServiceManagementService.Data;
using ServiceManagementService.Models;
using ServiceManagementService.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization; // Adicionado para JsonIgnoreCondition

namespace ServiceManagementService.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ServiceController : ControllerBase
{
    private readonly ServiceContext _context;
    private readonly CompanyContext _companyContext;
    private readonly PartsContext _partsContext;
    
    private readonly HttpClient _httpClient;

    public ServiceController(
        ServiceContext context,
        CompanyContext companyContext,
        PartsContext partsContext,
        HttpClient httpClient)
    {
        _context = context;
        _companyContext = companyContext;
        _partsContext = partsContext;
        _httpClient = httpClient;

        _httpClient.BaseAddress = new Uri("http://localhost:5001/"); 
    }

    private async Task<WorkerDto?> GetWorkerDetails(int id)
    {
        try
        {
            Console.WriteLine($"DEBUG: Attempting to fetch worker details for ID: {id}");
            string requestUrl = $"api/users/{id}";

            Console.WriteLine($"DEBUG: Full request URL: {_httpClient.BaseAddress}{requestUrl}");

            var response = await _httpClient.GetAsync(requestUrl);

            Console.WriteLine($"DEBUG: HTTP Response Status: {response.StatusCode}");
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"DEBUG: HTTP Response Content: {await response.Content.ReadAsStringAsync()}");
                return null;
            }

            var json = await response.Content.ReadAsStringAsync(); 
            var worker = JsonSerializer.Deserialize<WorkerDto>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            return worker;
        }
        catch (HttpRequestException ex)
        {
            Console.WriteLine($"Error getting user with id {id}: {ex.Message}"); 
            return null;
        }
    }

    // GET: api/services/
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceDto>>> GetService(
        [FromQuery] string? priority,
        [FromQuery] int? company_id,
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
            .Include(s => s.Company)
            .Include(s => s.Parts)
            .Include(s => s.Status)
            .Include(s => s.Machine)
            .AsQueryable();

        if (company_id.HasValue)
        {
            query = query.Where(a => a.CompanyId == company_id.Value);
        }
        if (worker_id.HasValue)
        {
            query = query.Where(a => a.WorkerId == worker_id.Value);
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

        var services = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var serviceDtos = new List<ServiceDto>();
        foreach (var service in services)
        {
            WorkerDto? workerDetails = null;
            // A chamada para GetWorkerDetails para enriquecer o DTO ainda ocorre aqui para GET
            // Se o UserManagementService não estiver disponível, TechnicianName será nulo.
            if (service.WorkerId.HasValue)
            {
                workerDetails = await GetWorkerDetails(service.WorkerId.Value); 
            }

            serviceDtos.Add(new ServiceDto
            {
                Id = service.Id,
                Priority = service.Priority,
                Category = service.Category,
                CompanyId = service.CompanyId,
                CompanyName = service.Company?.Name,
                Company = service.Company,
                WorkerId = service.WorkerId,
                TechnicianName = workerDetails?.Name,
                PartsId = service.PartsId,
                DateStarted = service.DateStarted,
                DateFinished = service.DateFinished,
                MotiveRescheduled = service.MotiveRescheduled,
                StatusId = service.StatusId,
                Status = service.Status?.Description,
                ClientSignature = service.ClientSignature,
                CreatedDate = service.CreatedDate,
                ModifiedDate = service.ModifiedDate,
                Parts = service.Parts,
                MachineId = service.MachineId,
                Machine = service.Machine,
                Description = service.Description
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
    public async Task<ActionResult<ServiceDto>> GetServive(int id)
    {
        var service = await _context.Services
            .Include(s => s.Company)
            .Include(s => s.Parts)
            .Include(s => s.Status)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (service == null)
        {
            return NotFound();
        }

        WorkerDto? workerDetails = null;
        if (service.WorkerId.HasValue)
        {
            workerDetails = await GetWorkerDetails(service.WorkerId.Value);
        }

        return Ok(new ServiceDto
        {
            Id = service.Id,
            Priority = service.Priority,
            Category = service.Category,
            CompanyId = service.CompanyId,
            CompanyName = service.Company?.Name,
            Company = service.Company,
            WorkerId = service.WorkerId,
            TechnicianName = workerDetails?.Name,
            PartsId = service.PartsId,
            DateStarted = service.DateStarted,
            DateFinished = service.DateFinished,
            MotiveRescheduled = service.MotiveRescheduled,
            StatusId = service.StatusId,
            Status = service.Status?.Description,
            ClientSignature = service.ClientSignature,
            CreatedDate = service.CreatedDate,
            ModifiedDate = service.ModifiedDate,
            Parts = service.Parts,
            MachineId = service.MachineId,
            Machine = service.Machine,
            Description = service.Description
        });
    }

    // POST: api/services
    [HttpPost]
    public async Task<ActionResult<Service>> PostService(Service service)
    {
        Console.WriteLine($"DEBUG: PostService received. ModelState.IsValid: {ModelState.IsValid}");
        Console.WriteLine($"DEBUG: Received Service CompanyId (raw): {service.CompanyId}");
        Console.WriteLine($"DEBUG: Received Service WorkerId (raw): {service.WorkerId}");
        Console.WriteLine($"DEBUG: Received Service PartsId (raw): {service.PartsId}");
        Console.WriteLine($"DEBUG: Received Service Category: '{service.Category ?? "NULL"}'");

        if (!ModelState.IsValid)
        {
            Console.WriteLine("DEBUG: ModelState is invalid. Errors:");
            foreach (var modelStateEntry in ModelState.Values)
            {
                foreach (var error in modelStateEntry.Errors)
                {
                    Console.WriteLine($"- {error.ErrorMessage}");
                }
            }
            return BadRequest(ModelState);
        }

        // --- Validação da empresa ---
        if (!service.CompanyId.HasValue) 
        {
            Console.WriteLine("DEBUG: CompanyId is NULL. Returning BadRequest: 'Company ID is required.'");
            return BadRequest("Company ID is required.");
        }

        var companyCount = await _companyContext.Companies.CountAsync();
        Console.WriteLine($"DEBUG: Total companies visible to _companyContext: {companyCount}");
        
        var companyExists = await _companyContext.Companies.AnyAsync(st => st.Id == service.CompanyId.Value);
        Console.WriteLine($"DEBUG: Company ID {service.CompanyId.Value} exists in DB: {companyExists}");
        
        if (!companyExists)
        {
            return BadRequest("The company does not exist.");
        }

        // --- Validação do trabalhador (MODIFICADO) ---
        // A chamada HTTP para o UserManagementService e a sua validação foram removidas aqui.
        // O ServiceManagementService NÃO verificará se o WorkerId existe em outro serviço.
        // Se o WorkerId for obrigatório para o modelo Service, verifique apenas se tem um valor.
        if (!service.WorkerId.HasValue)
        {
            Console.WriteLine("DEBUG: WorkerId is NULL. Returning BadRequest: 'Worker ID is required.'");
            return BadRequest("Worker ID is required.");
        }
        // Se o WorkerId não for obrigatório, remova o 'if' acima também.

        var utcNow = DateTime.UtcNow;
        service.CreatedDate = utcNow;
        service.ModifiedDate = utcNow;

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

        // Validação de CompanyId, PartsId para PUT
        if (!service.CompanyId.HasValue || !await _companyContext.Companies.AnyAsync(st => st.Id == service.CompanyId.Value))
        {
            return BadRequest("The company does not exist or Company ID is required.");
        }
        if (!service.PartsId.HasValue || !await _partsContext.Parts.AnyAsync(m => m.Id == service.PartsId.Value))
        {
            return BadRequest("The parts does not exist or Parts ID is required.");
        }


        service.ModifiedDate = DateTime.UtcNow;

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
