using System.Text.Json; // Para JsonSerializer e JsonElement
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using ServiceManagementService.Data;
using ServiceManagementService.Models;
using ServiceManagementService.Services; // Para RabbitMQService

namespace csharp_crud_api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AppointmentController : ControllerBase
{
    private readonly AppointmentContext _context;
    private readonly StatusContext _statusContext;
    private readonly MachineContext _machineContext;
    private readonly RabbitMQService _rabbitMQService;

    public AppointmentController(AppointmentContext context, StatusContext statusContext, MachineContext machineContext, RabbitMQService rabbitMQService)
    {
        _context = context;
        _statusContext = statusContext;
        _machineContext = machineContext;
        _rabbitMQService = rabbitMQService;
    }

    private int GetUserIdFromToken()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "user_id");
        return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
    }

    // GET: api/Appointments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
    {
        return await _context.Appointments.ToListAsync();
    }

    // GET: api/Appointments/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Appointment>> GetUAppointment(int id)
    {
        var appointment = await _context.Appointments.FindAsync(id);

        if (appointment == null)
        {
            return NotFound();
        }

        return appointment;
    }

    // POST: api/Appointments
    [HttpPost]
    public async Task<ActionResult<Appointment>> PostAppointment(Appointment appointment)
    {
        int userId = GetUserIdFromToken(); // Obtém user_id do token

        if (userId == 0)
        {
            return Unauthorized("Invalid user.");
        }

        // Enviar solicitação ao UserManagementService para validar o user_id
        var message = JsonSerializer.Serialize(new { UserId = userId });
        _rabbitMQService.SendMessage("user.validate", message);

        var response = _rabbitMQService.ReceiveMessage("user.validate.response");

        if (string.IsNullOrEmpty(response))
        {
            return StatusCode(500, "No response from user management service.");
        }

        var responseObject = JsonSerializer.Deserialize<JsonElement>(response);
        if (!responseObject.TryGetProperty("Status", out var status) || status.GetString() != "Success")
        {
            return Unauthorized("User does not exist.");
        }

        appointment.Client_id = userId; // Salvar o user_id como client_id

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUAppointment), new { id = appointment.Id }, appointment);
    }

    // PUT: api/appointments/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutAppointment(int id, Appointment appointment)
    {
        if (id != appointment.Id)
        {
            return BadRequest();
        }
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var statusExists = _statusContext.Statuss.Any(st => st.Id == appointment.Status_id);
        if (!statusExists)
        {
            return BadRequest("The status type does not exist.");
        }
        var machineExists = _machineContext.Machines.Any(m => m.Id == appointment.Machine_id);
        if (!machineExists)
        {
            return BadRequest("The machine does not exist.");
        }

        _context.Entry(appointment).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AppointmentExists(id))
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

    // DELETE: api/appointment/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAppointment(int id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null)
        {
            return NotFound();
        }

        _context.Appointments.Remove(appointment);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool AppointmentExists(int id)
    {
        return _context.Appointments.Any(e => e.Id == id);
    }

    // Dummy method to test the connection
    [HttpGet("hello")]
    public string Test()
    {
        return "Hello World!";
    }
}
