// ServiceManagementService/Models/ServiceResponseDto.cs
using System; // For DateOnly and DateTime
// using ServiceManagementService.Models; // Not needed if this DTO is in the same namespace as other models it references

namespace ServiceManagementService.Models
{
    public class ServiceResponseDto
    {
        public int Id { get; set; }
        public int? Appointment_id { get; set; }

        // Worker information
        public int? Worker_id { get; set; }
        public string? WorkerName { get; set; } // This will hold the details from the User Management Service

        public int? Parts_id { get; set; }
        public DateOnly? Date_started { get; set; }
        public DateOnly? Date_finished { get; set; }
        public string? Motive_rescheduled { get; set; }
        public int? Status_id { get; set; }
        public string? StatusName { get; set; } // To display the status name directly
        public string? Client_signature { get; set; }
        public DateTime? Created_date { get; set; }
        public DateTime? Modified_date { get; set; }

        // You might want to include simplified versions of related local entities here
        // or just their IDs, depending on what your API clients need.
        // For now, I'll include the full models as you had in your controller example.
        public Appointment? Appointment { get; set; }
        public Parts? Parts { get; set; }
        // Note: Status is already covered by Status_id and StatusName, but if you need the full object, uncomment below.
        // public Status? Status { get; set; }
    }
}