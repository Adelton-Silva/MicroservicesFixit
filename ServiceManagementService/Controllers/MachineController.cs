using ServiceManagementService.Data;
using ServiceManagementService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace csharp_crud_api.Controllers;

[Authorize]
[ApiController]
[Route("api/machine")]
public class MachineController : ControllerBase
{
    private readonly MachineContext _context;
    private readonly Machine_modContext _machineModContext;
    private readonly CompanyContext _companyContext;

    public MachineController(MachineContext context, Machine_modContext machineModContext, CompanyContext companyContext)
    {
        _context = context;
        _machineModContext = machineModContext;
        _companyContext = companyContext;
    }

    // GET: api/machine_models
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Machine>>> GetMachine(
        [FromQuery] int? company_id,
        [FromQuery] string? serial_number,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10
    )
    {
        if (page <= 0 || pageSize <= 0)
        {
            return BadRequest(new { Message = "Page and pageSize must be greater than 0." });
        }

        var query = _context.Machines.AsQueryable();

        if (!string.IsNullOrEmpty(serial_number))
        {
            query = query.Where(a => a.serial_number != null && a.serial_number.Contains(serial_number));
        } 
        
        if (company_id.HasValue)
        {
        var company = await _companyContext.Companies.FindAsync(company_id.Value);
        if (company != null)
        {
            query = query.Where(a => a.Company_id == company_id.Value);
        }
        } 

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var machines = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(machines);
    }

    // GET: api/machine_models/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Machine>> GetUMachine(int id)
    {
        var machine = await _context.Machines.FindAsync(id);

        if (machine == null)
        {
            return NotFound();
        }

        return machine;
    }

    // POST: api/machine_models
    [HttpPost]
    public async Task<ActionResult<Machine_mod>> PostMachineMod(Machine machine)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var companyExists = _companyContext.Companies.Any(c => c.Id == machine.Company_id);
        if (!companyExists)
        {
            return BadRequest("The company does not exist.");
        }
        _context.Machines.Add(machine);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMachine), new { id = machine.Id }, machine);
    }

    // PATCH: api/machine_models/5
    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchMachine(int id, Machine machine)
    {
        var existingMachine = await _context.Machines.FindAsync(id);
        if (existingMachine == null)
            return NotFound("The machine does not exist.");
            
        if (machine.Company_id != null)
            existingMachine.Company_id = machine.Company_id;
            
        if(machine.serial_number != null)
            existingMachine.serial_number = machine.serial_number;

        if(machine.type != null)
            existingMachine.type = machine.type;
            
        if(machine.brand != null)   
            existingMachine.brand = machine.brand;
            
        if(machine.model != null)
            existingMachine.model = machine.model;

        if (machine.number_hours != null)
            existingMachine.number_hours = machine.number_hours;
        
        if(machine.last_maintenance_date != null)
            existingMachine.last_maintenance_date = machine.last_maintenance_date;
        
        if(machine.Isactive != null)
            existingMachine.Isactive = machine.Isactive;
        
        if(machine.created_date != null)
            return BadRequest("The created_date cannot be modified.");

        if(machine.modified_date != null)
            return BadRequest("The created_date cannot be modified.");

        existingMachine.modified_date = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MachineExists(id))
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

    // DELETE: api/machine_types/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMachine(int id)
    {
        var machine = await _context.Machines.FindAsync(id);
        if (machine == null)
        {
            return NotFound();
        }

        _context.Machines.Remove(machine);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool MachineExists(int id)
    {
        return _context.Machines.Any(e => e.Id == id);
    }

}