using ServiceManagementService.Data;
using ServiceManagementService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace csharp_crud_api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MachineTypeController : ControllerBase
{
    private readonly Machine_typeContext _context;
    public MachineTypeController(Machine_typeContext context) 
    {
        _context = context;
    }

    // GET: api/machine_types
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Machine_type>>> GetMachineTypes()
    {
        return await _context.Machine_types.ToListAsync();
    }

    // GET: api/machine_types/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Machine_type>> GetUMachineType(int id)
    {
        var machine_type = await _context.Machine_types.FindAsync(id);

        if (machine_type == null)
        {
            return NotFound();
        }

        return machine_type;
    }

    // POST: api/machine_types
    [HttpPost]
    public async Task<ActionResult<Machine_type>> PostMachineType(Machine_type machine_type)
    {
        _context.Machine_types.Add(machine_type);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMachineTypes), new { id = machine_type.Id }, machine_type);
    }

     // PUT: api/machine_types/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMachineType(int id, Machine_type machine_type)
    {
        if (id != machine_type.Id)
        {
            return BadRequest();
        }

        _context.Entry(machine_type).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!Machine_typeExists(id))
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
    public async Task<IActionResult> DeleteMachineType(int id)
    {
        var machine_type = await _context.Machine_types.FindAsync(id);
        if (machine_type == null)
        {
            return NotFound();
        }

        _context.Machine_types.Remove(machine_type);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool Machine_typeExists(int id)
    {
        return _context.Machine_types.Any(e => e.Id == id);
    }

}