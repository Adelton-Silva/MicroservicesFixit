using ServiceManagementService.Models; // Add this if you include Company or Parts models directly

namespace ServiceManagementService.Dtos;

public class ServiceDto
{
    public int Id { get; set; }
    public string? Priority { get; set; }
    public string? Category { get; set; }
    public int? CompanyId { get; set; }
    public string? CompanyName { get; set; } // For the company's name

    public Company? Company { get; set; } // This is crucial for 'ServiceDto' does not contain a definition for 'Company'

    public int? WorkerId { get; set; }
    public string? TechnicianName { get; set; } // For the worker's name
    public int? PartsId { get; set; }
    public DateTime? DateStarted { get; set; }
    public DateTime? DateFinished { get; set; }
    public string? MotiveRescheduled { get; set; } // Add this

    public string? Description { get; set; }
    public int? StatusId { get; set; } // Add this
    public string? Status { get; set; } // For the status description
    public string? ClientSignature { get; set; } // Add this
    public DateTime? CreatedDate { get; set; } // Add this
    public DateTime? ModifiedDate { get; set; } // Add this

    public Parts? Parts { get; set; } // This is crucial for 'ServiceDto' does not contain a definition for 'Parts'

    public Machine? Machine { get; set; }
    
    public int? MachineId { get; set; }
}