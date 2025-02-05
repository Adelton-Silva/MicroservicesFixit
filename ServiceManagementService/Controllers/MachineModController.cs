using ServiceManagementService.Data;
using ServiceManagementService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace csharp_crud_api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MachineModController : ControllerBase
{
    private readonly Machine_modContext _context;
    private readonly Machine_typeContext _machineTypeContext;

    public MachineModController(Machine_modContext context, Machine_typeContext machineTypeContext)
    {
        _context = context;
        _machineTypeContext = machineTypeContext;
    }

    // GET: api/machine_models
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Machine_mod>>> GetMachineMods()
    {
        return await _context.Machine_mods.ToListAsync();
    }

    // GET: api/machine_models/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Machine_mod>> GetUMachineMod(int id)
    {
        var machine_mod = await _context.Machine_mods.FindAsync(id);

        if (machine_mod == null)
        {
            return NotFound();
        }

        return machine_mod;
    }

    // POST: api/machine_models
    [HttpPost]
    public async Task<ActionResult<Machine_mod>> PostMachineMod(Machine_mod machine_mod)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var machineTypeExists = _machineTypeContext.Machine_types.Any(mt => mt.Id == machine_mod.Machine_type_id);
        if (!machineTypeExists)
        {
            return BadRequest("The machine type does not exist.");
        }
        _context.Machine_mods.Add(machine_mod);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMachineMods), new { id = machine_mod.Id }, machine_mod);
    }

    // PUT: api/machine_models/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMachineMod(int id, Machine_mod machine_mod)
    {
        if (id != machine_mod.Id)
        {
            return BadRequest();
        }
         if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var machineTypeExists = _machineTypeContext.Machine_types.Any(mt => mt.Id == machine_mod.Machine_type_id);
        if (!machineTypeExists)
        {
            return BadRequest("The machine type does not exist.");
        }

        _context.Entry(machine_mod).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!Machine_modExists(id))
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
    public async Task<IActionResult> DeleteMachineMod(int id)
    {
        var machine_mod = await _context.Machine_mods.FindAsync(id);
        if (machine_mod == null)
        {
            return NotFound();
        }

        _context.Machine_mods.Remove(machine_mod);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool Machine_modExists(int id)
    {
        return _context.Machine_mods.Any(e => e.Id == id);
    }

}