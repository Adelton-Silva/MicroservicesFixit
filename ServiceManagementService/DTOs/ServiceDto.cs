namespace ServiceManagementService.Dtos;

public class ServiceDto
{
    public int Id { get; set; }
    public int? AppointmentId { get; set; }
    public string? AppointmentTitle { get; set; }
    public int? WorkerId { get; set; }
    public string? TechnicianName { get; set; }
    public int? PartsId { get; set; }
    public DateTime? DateStarted { get; set; }
    public DateTime? DateFinished { get; set; }
    public string? Status { get; set; }
}
