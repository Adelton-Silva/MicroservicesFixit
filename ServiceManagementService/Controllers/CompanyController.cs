using ServiceManagementService.Data;
using ServiceManagementService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace csharp_crud_api.Controllers;

[Authorize]
[ApiController]
[Route("api/company")]
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

        return Ok(companies);
    }


    // POST: api/companies
    [HttpPost]
    public async Task<ActionResult<Company>> PostCompany(Company company)
    {
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCompany), new { id = company.Id }, company);
    }

    // PATCH: api/companies/5
    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchCompany(int id, Company company)
    {
         var existingCompany = await _context.Companies.FindAsync(id);
        if (existingCompany == null)
            return NotFound("Company not found.");
        

        if (company.Name != null)
            existingCompany.Name = company.Name;
        
        if(company.Nif.HasValue)
            existingCompany.Nif = company.Nif;
            
        if(company.Address != null)
            existingCompany.Address = company.Address;
            
        if(company.Email != null)
            existingCompany.Email = company.Email;
            
        if(company.Phone != null)
            existingCompany.Phone = company.Phone;
            
        if(company.Postal_code != null)
            existingCompany.Postal_code = company.Postal_code;
        
        if(company.Location_reference != null)
            existingCompany.Location_reference = company.Location_reference;

        if(company.Isactive.HasValue)
            existingCompany.Isactive = company.Isactive;
        
        if(company.Created_date.HasValue)
            return BadRequest("Created_date cannot be modified.");

        if (company.Modified_date.HasValue)
            return BadRequest("Modified_date cannot be modified.");

        existingCompany.Modified_date = DateTime.UtcNow;

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