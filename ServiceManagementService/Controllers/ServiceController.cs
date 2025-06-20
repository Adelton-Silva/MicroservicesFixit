using ServiceManagementService.Data;
using ServiceManagementService.Models;
using ServiceManagementService.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;

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
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ServiceController(
        ServiceContext context,
        CompanyContext companyContext,
        PartsContext partsContext,
        StatusContext statusContext,
        HttpClient httpClient,
        IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _companyContext = companyContext;
        _partsContext = partsContext;
        _statusContext = statusContext;
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("http://user_management_service:5001/");
        _httpContextAccessor = httpContextAccessor;
    }

    private async Task<WorkerDto?> GetWorkerDetails(int id)
    {
        try
        {
            string requestUrl = $"api/users/{id}";

            var accessToken = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].FirstOrDefault();

            if (!string.IsNullOrEmpty(accessToken))
            {
                _httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken.Replace("Bearer ", ""));
            }

            var response = await _httpClient.GetAsync(requestUrl);
            if (!response.IsSuccessStatusCode)
                return null;

            var json = await response.Content.ReadAsStringAsync();
            var worker = JsonSerializer.Deserialize<WorkerDto>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            return worker;
        }
        catch (HttpRequestException)
        {
            return null;
        }
    }

    // GET: api/service
    [HttpGet]
    public async Task<ActionResult> GetService(
        [FromQuery] string? priority,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate,
        [FromQuery] int? company_id,
        [FromQuery] int? status,
        [FromQuery] int? worker_id,
        [FromQuery] int? status_id,
        [FromQuery] int? excludeStatusId,
        [FromQuery] int? includeStatusId,
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
            // var startMonth = startDate.Value.Month;
            // var startYear = startDate.Value.Year;
            // var endMonth = endDate.Value.Month;
            // var endYear = endDate.Value.Year;
            query = query.Where(a =>
                (a.DateStarted.HasValue && a.DateStarted.Value >= startDate.Value && a.DateStarted.Value <= endDate.Value) ||
                (a.DateFinished.HasValue && a.DateFinished.Value >= startDate.Value && a.DateFinished.Value <= endDate.Value)
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
            query = query.Where(s => s.Priority == priority);
        }
        if (company_id.HasValue)
        {
            query = query.Where(a => a.CompanyId == company_id.Value);
        }
        if (worker_id.HasValue)
        {
            query = query.Where(a => a.WorkerId == worker_id.Value);
        }
        if (status_id.HasValue)
        {
            query = query.Where(a => a.StatusId == status_id.Value);
        }
        if (excludeStatusId.HasValue)
        {
            query = query.Where(a => a.StatusId != excludeStatusId.Value);
        }
        if (includeStatusId.HasValue)
        {
            query = query.Where(a => a.StatusId == includeStatusId.Value);
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

        var now = DateTime.UtcNow;

        var services = await query
            .OrderBy(s => s.DateStarted == null ? double.MaxValue : Math.Abs((s.DateStarted.Value - now).TotalSeconds))
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var serviceDtos = new List<ServiceDto>();
        foreach (var service in services)
        {
            WorkerDto? workerDetails = null;
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
            PageNumber = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages,
            Data = serviceDtos
        });
    }

    // GET: api/service/5
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

    // POST: api/service
    [HttpPost]
    public async Task<ActionResult<Service>> PostService([FromBody] CreateServiceDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (!dto.CompanyId.HasValue)
            return BadRequest("Company ID is required.");

        var companyExists = await _companyContext.Companies.AnyAsync(st => st.Id == dto.CompanyId.Value);
        if (!companyExists)
            return BadRequest("The company does not exist.");

        if (!dto.WorkerId.HasValue)
            return BadRequest("Worker ID is required.");

        var utcNow = DateTime.UtcNow;

        var service = new Service
        {
            Priority = dto.Priority,
            Category = dto.Category,
            CompanyId = dto.CompanyId,
            WorkerId = dto.WorkerId,
            PartsId = dto.PartsId,
            DateStarted = dto.DateStarted,
            DateFinished = dto.DateFinished,
            MotiveRescheduled = dto.MotiveRescheduled,
            Description = dto.Description,
            StatusId = dto.StatusId,
            MachineId = dto.MachineId,
            ClientSignature = dto.ClientSignature,
            CreatedDate = utcNow,
            ModifiedDate = utcNow
        };

        _context.Services.Add(service);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetServive), new { id = service.Id }, service);
    }


    // PATCH: api/service/5
    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchService(int id, [FromBody] UpdateServiceDto serviceDto)
    {
        var existingService = await _context.Services.FindAsync(id);
        if (existingService == null)
            return NotFound("The service does not exist.");

        if (serviceDto.Priority != null)
            existingService.Priority = serviceDto.Priority;

        if (serviceDto.Category != null)
            existingService.Category = serviceDto.Category;

        if (serviceDto.CompanyId.HasValue)
        {
            var existingCompany = await _companyContext.Companies.FindAsync(serviceDto.CompanyId.Value);
            if (existingCompany == null)
                return BadRequest("The company does not exist.");
            existingService.CompanyId = serviceDto.CompanyId.Value;
        }

        if (serviceDto.WorkerId.HasValue)
        {
            var workerExists = await GetWorkerDetails(serviceDto.WorkerId.Value);
            if (workerExists == null)
                return BadRequest("Invalid Worker ID.");
            existingService.WorkerId = serviceDto.WorkerId.Value;
        }

        if (serviceDto.PartsId.HasValue)
        {
            var partsExists = await _partsContext.Parts.AnyAsync(p => p.Id == serviceDto.PartsId.Value);
            if (!partsExists)
                return BadRequest("Invalid Parts ID.");
            existingService.PartsId = serviceDto.PartsId.Value;
        }

        if (serviceDto.DateStarted.HasValue)
            existingService.DateStarted = DateTime.SpecifyKind(serviceDto.DateStarted.Value, DateTimeKind.Utc);

        if (serviceDto.DateFinished.HasValue)
            existingService.DateFinished = DateTime.SpecifyKind(serviceDto.DateFinished.Value, DateTimeKind.Utc);

        if (serviceDto.MotiveRescheduled != null)
            existingService.MotiveRescheduled = serviceDto.MotiveRescheduled;

        if (serviceDto.Description != null)
            existingService.Description = serviceDto.Description;

        if (serviceDto.StatusId.HasValue)
        {
            var statusExists = await _statusContext.Statuss.AnyAsync(s => s.Id == serviceDto.StatusId.Value);
            if (!statusExists)
                return BadRequest("Invalid Status ID.");
            existingService.StatusId = serviceDto.StatusId.Value;
        }

        if (serviceDto.MachineId.HasValue)
            existingService.MachineId = serviceDto.MachineId;

        if (serviceDto.ClientSignature != null)
            existingService.ClientSignature = serviceDto.ClientSignature;

        existingService.ModifiedDate = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ServiceExists(id))
                return NotFound();
            throw;
        }

        return NoContent();
    }


    // DELETE: api/service/5
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