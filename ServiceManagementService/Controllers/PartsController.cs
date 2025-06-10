using ServiceManagementService.Data;
using ServiceManagementService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace csharp_crud_api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PartsController : ControllerBase
{
    private readonly PartsContext _context;
    public PartsController(PartsContext context)
    {
        _context = context;
    }

    // GET: api/Parts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Parts>>> GetParts()
    {
        return await _context.Parts.ToListAsync(); // <--- Corrected
    }

    // GET: api/Parts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Parts>> GetParts(int id)
    {
        var parts = await _context.Parts.FindAsync(id); // <--- Corrected

        if (parts == null)
        {
            return NotFound();
        }

        return parts;
    }

    // POST: api/Parts
    [HttpPost]
    public async Task<ActionResult<Parts>> PostParts(Parts parts)
    {
        _context.Parts.Add(parts); // <--- Corrected
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetParts), new { id = parts.Id }, parts);
    }

    // PUT: api/parts/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutParts(int id, Parts parts)
    {
        if (id != parts.Id)
        {
            return BadRequest();
        }

        _context.Entry(parts).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            // The PartsExists check should also use _context.Parts
            if (!PartsExists(id))
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

    // DELETE: api/parts/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteParts(int id)
    {
        var parts = await _context.Parts.FindAsync(id); // <--- Corrected
        if (parts == null)
        {
            return NotFound();
        }

        _context.Parts.Remove(parts); // <--- Corrected
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool PartsExists(int id)
    {
        return _context.Parts.Any(e => e.Id == id); // <--- Corrected
    }

}