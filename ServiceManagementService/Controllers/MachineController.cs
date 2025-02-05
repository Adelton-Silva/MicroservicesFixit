using ServiceManagementService.Data;
using ServiceManagementService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace csharp_crud_api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
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
    public async Task<ActionResult<IEnumerable<Machine>>> GetMachine()
    {
        return await _context.Machines.ToListAsync();
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
        var machineModExists = _machineModContext.Machine_mods.Any(mm => mm.Id == machine.Machine_mod_id);
        if (!machineModExists )
        {
            return BadRequest("The machine model does not exist.");
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

    // PUT: api/machine_models/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMachine(int id, Machine machine)
    {
        if (id != machine.Id)
        {
            return BadRequest();
        }
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var machineModExists = _machineModContext.Machine_mods.Any(mm => mm.Id == machine.Machine_mod_id);
        if (!machineModExists )
        {
            return BadRequest("The machine model does not exist.");
        }
        var companyExists = _companyContext.Companies.Any(c => c.Id == machine.Company_id);
        if (!companyExists)
        {
            return BadRequest("The company does not exist.");
        }

        _context.Entry(machine).State = EntityState.Modified;

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