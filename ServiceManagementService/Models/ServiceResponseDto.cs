// ServiceManagementService.Models/ServiceResponseDto.cs (or ServiceManagementService.Dtos/ServiceResponseDto.cs)
using System; // For DateOnly

namespace ServiceManagementService.Models
{
    public class ServiceResponseDto
    {
        public int Id { get; set; } // Non-nullable, matches Service.cs Id
        public string? Priority { get; set; } // Matches Service.cs
        public string? Category { get; set; }

        public int Appointment_id { get; set; } // Non-nullable, matches Service.cs
        public string? AppointmentTitle { get; set; } // For display

        public int? Worker_id { get; set; } // Nullable, matches Service.cs
        public string? WorkerName { get; set; } // For display

        public int? Parts_id { get; set; } // Nullable, matches Service.cs

        public DateOnly Date_started { get; set; } // Non-nullable, matches Service.cs
        public DateOnly? Date_finished { get; set; } // Nullable, matches Service.cs

        public string? Motive_rescheduled { get; set; }
        public string? Description { get; set; }

        public int? Status_id { get; set; } // Nullable, matches Service.cs
        public string? StatusName { get; set; } // For display

        public string? Client_signature { get; set; }

        public DateTime Created_date { get; set; } // Non-nullable, matches Service.cs
        public DateTime? Modified_date { get; set; } // Nullable, matches Service.cs

        // If you still want to return full objects, make sure their types are correct
        public Appointment? Appointment { get; set; }
        public Parts? Parts { get; set; }

        public Machine? Machine { get; set; }
        
        public int? Machine_id { get; set; }
        // No Status object here, as you're using StatusName
    }
}