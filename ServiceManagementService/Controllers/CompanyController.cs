using ServiceManagementService.Data;
using ServiceManagementService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace csharp_crud_api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CompanyController : ControllerBase
{
    private readonly CompanyContext _context;
    public CompanyController(CompanyContext context)
    {
        _context = context;
    }

    // GET: api/companies
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Company>>> GetCompany(
    [FromQuery] string? name,
    [FromQuery] string? nif,
    [FromQuery] string? address,
    [FromQuery] string? email,
    [FromQuery] string? phone,
    [FromQuery] string? postalCode,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10
)
    {
        if (page <= 0 || pageSize <= 0)
        {
            return BadRequest(new { Message = "Page and pageSize must be greater than 0." });
        }

        var query = _context.Companies.AsQueryable();

        if (!string.IsNullOrEmpty(name))
        {
            query = query.Where(a => a.Name != null && a.Name.Contains(name));
        }
        if (!string.IsNullOrEmpty(nif))
        {
            query = query.Where(a => a.Nif != null && a.Nif.ToString().Contains(nif));
        }
        if (!string.IsNullOrEmpty(address))
        {
            query = query.Where(a => a.Address != null && a.Address.Contains(address));
        }
        if (!string.IsNullOrEmpty(email))
        {
            query = query.Where(a => a.Email != null && a.Email.Contains(email));
        }
        if (!string.IsNullOrEmpty(phone))
        {
            query = query.Where(a => a.Phone != null && a.Phone.Contains(phone));
        }
        if (!string.IsNullOrEmpty(postalCode))
        {
            query = query.Where(a => a.Postal_code != null && a.Postal_code.Contains(postalCode));
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var companies = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            Page = page,
            PageSize = pageSize,
            TotalPages = totalPages,
            TotalItems = totalItems,
            Data = companies
        });
    }


    // POST: api/companies
    [HttpPost]
    public async Task<ActionResult<Company>> PostCompany(Company company)
    {
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCompany), new { id = company.Id }, company);
    }

    // PUT: api/companies/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCompany(int id, Company company)
    {
        if (id != company.Id)
        {
            return BadRequest();
        }

        _context.Entry(company).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CompanyExists(id))
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

    // DELETE: api/companies/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCompany(int id)
    {
        var company = await _context.Companies.FindAsync(id);
        if (company == null)
        {
            return NotFound();
        }

        _context.Companies.Remove(company);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CompanyExists(int id)
    {
        return _context.Companies.Any(e => e.Id == id);
    }

}