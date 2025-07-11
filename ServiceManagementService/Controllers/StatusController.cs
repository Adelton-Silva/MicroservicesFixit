using ServiceManagementService.Data;
using ServiceManagementService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace csharp_crud_api.Controllers;

[Authorize]
[ApiController]
[Route("api/status")]
public class StatusController : ControllerBase
{
    private readonly StatusContext _context;
    public StatusController(StatusContext context) 
    {
        _context = context;
    }

     // GET: api/status
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Status>>> GetStatus()
    {
        return await _context.Statuss.ToListAsync();
    }

    // GET: api/status/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Status>> GetStatus(int id)
    {
        var status = await _context.Statuss.FindAsync(id);

        if (status == null)
        {
            return NotFound();
        }

        return status;
    }

    // POST: api/status
    [HttpPost]
    public async Task<ActionResult<Status>> PostStatus(Status status)
    {
        _context.Statuss.Add(status);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetStatus), new { id = status.Id }, status);
    }

     // PATCHA: api/status/5
    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchStatus(int id, Status status)
    {
        var existingStatus = await _context.Statuss.FindAsync(id);
        if (existingStatus == null)
            return NotFound("Status not found");
        
        if(status.Description != null)
            existingStatus.Description = status.Description;
        
        existingStatus.Modified_date = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!StatusExists(id))
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

    // DELETE: api/status/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStatus(int id)
    {
        var status = await _context.Statuss.FindAsync(id);
        if (status == null)
        {
            return NotFound();
        }

        _context.Statuss.Remove(status);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool StatusExists(int id)
    {
        return _context.Statuss.Any(e => e.Id == id);
    }

}