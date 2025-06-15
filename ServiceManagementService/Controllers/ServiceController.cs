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
[Route("api/service")]
public class ServiceController : ControllerBase
{
    private readonly ServiceContext _context;
    private readonly CompanyContext _companyContext;
    private readonly PartsContext _partsContext;

    private readonly StatusContext _statusContext;

    private readonly HttpClient _httpClient;

    public ServiceController(
        ServiceContext context,
        CompanyContext companyContext,
        PartsContext partsContext,
        StatusContext statusContext,
        HttpClient httpClient)
    {
        _context = context;
        _companyContext = companyContext;
        _partsContext = partsContext;
        _statusContext = statusContext;
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
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate,
        [FromQuery] int? company_id,
        [FromQuery] int? status,
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


        if (startDate.HasValue && startDate.Value.Kind != DateTimeKind.Utc)
            startDate = DateTime.SpecifyKind(startDate.Value, DateTimeKind.Utc);

        if (endDate.HasValue && endDate.Value.Kind != DateTimeKind.Utc)
            endDate = DateTime.SpecifyKind(endDate.Value, DateTimeKind.Utc);


        if (startDate.HasValue && endDate.HasValue)
        {
            var startMonth = startDate.Value.Month;
            var startYear = startDate.Value.Year;
            var endMonth = endDate.Value.Month;
            var endYear = endDate.Value.Year;
            query = query.Where(a =>
                (a.DateStarted.HasValue && a.DateStarted.Value.Month == startMonth && a.DateStarted.Value.Year == startYear) ||
                (a.DateFinished.HasValue && a.DateFinished.Value.Month == endMonth && a.DateFinished.Value.Year == endYear)
            );
        }
        else if (startDate.HasValue)
        {
            var month = startDate.Value.Month;
            var year = startDate.Value.Year;
            query = query.Where(a => a.DateStarted.HasValue &&
                                    a.DateStarted.Value.Month == month &&
                                    a.DateStarted.Value.Year == year);
        }
        else if (endDate.HasValue)
        {
            var month = endDate.Value.Month;
            var year = endDate.Value.Year;
            query = query.Where(a => a.DateFinished.HasValue &&
                                    a.DateFinished.Value.Month == month &&
                                    a.DateFinished.Value.Year == year);
        }
        if (status.HasValue)
        {
            query = query.Where(a => a.StatusId == status.Value);
        }
        if (!string.IsNullOrEmpty(priority))
        {
            query = query.Where(a => a.Priority == priority);
        }
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

        return Ok(serviceDtos);
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

    // PATCH: api/services/5
    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchService(int id, Service service)
    {
        var existingService = await _context.Services.FindAsync(id);
        if (existingService == null)
            return NotFound("The service does not exist.");
        
        if(service.Priority != null)
            existingService.Priority = service.Priority;
        
        if(service.Category != null)
            existingService.Category = service.Category;

        if (service.CompanyId.HasValue)
        {
            try
            {
                var existingCompany = await _companyContext.Companies.FindAsync(service.CompanyId);
                if (existingCompany.Id == null)
                    return BadRequest("The company does not exist or Company ID is required.");
                else
                    existingService.CompanyId = service.CompanyId;
            }
            catch (Exception ex){
                Console.WriteLine($"Error fetching company with ID {service.CompanyId}: {ex.Message}");
                return BadRequest("An error occurred while fetching the company.");
            }
        }    
        
        if(service.WorkerId != null)
        {
            if (await GetWorkerDetails(service.WorkerId.Value) == null)
                return BadRequest("Worker ID is required.");
            else
                existingService.WorkerId = service.WorkerId.Value;
        }

        if (service.PartsId != null)
        {
            try
            {
                if (!service.PartsId.HasValue || !await _partsContext.Parts.AnyAsync(m => m.Id == service.PartsId.Value))
                    return BadRequest("The parts does not exist or Parts ID is required.");
                else
                    existingService.PartsId = service.PartsId.Value;
            }catch (Exception ex)
            {
                Console.WriteLine($"Error fetching parts with ID {service.PartsId}: {ex.Message}");
                return BadRequest("An error occurred while fetching the parts.");
            }
        }    
        
        if(service.DateStarted != null)
            existingService.DateStarted = service.DateStarted;

        if(service.DateFinished != null)
            existingService.DateFinished = service.DateFinished;

        if(service.MotiveRescheduled != null)
            existingService.MotiveRescheduled = service.MotiveRescheduled;

        if(service.Description != null)
            existingService.Description = service.Description;

        if (service.StatusId != null)
        {
            try
            {
                if (!service.StatusId.HasValue || !await _statusContext.Statuss.AnyAsync(s => s.Id == service.StatusId.Value))
                    return BadRequest("The status does not exist or Status ID is required.");
                else
                    existingService.StatusId = service.StatusId.Value;
            }catch (Exception ex)
            {
                Console.WriteLine($"Error fetching status with ID {service.StatusId}: {ex.Message}");
                return BadRequest("An error occurred while fetching the status.");
            }
        }

        if(service.MachineId != null)
            existingService.MachineId = service.MachineId;  

        if(service.ClientSignature != null) 
            existingService.ClientSignature = service.ClientSignature;

        if (service.CreatedDate != null)
            return BadRequest("CreatedDate cannot be modified.");

        if(service.ModifiedDate != null)
            return BadRequest("ModifiedDate cannot be modified.");

        existingService.ModifiedDate = DateTime.UtcNow;

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
