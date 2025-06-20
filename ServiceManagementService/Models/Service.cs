using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ServiceManagementService.Models // Ensure this namespace is correct
{
    [Table("services")] // Assuming your table is named 'services'
    public class Service
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("priority")]
        [StringLength(10)]
        public string? Priority { get; set; }

        [Column("category")]
        [RegularExpression(@"^[a-zA-Z0-9çãáàéè ]*$", ErrorMessage = "Special characters are not allowed.")]
        [StringLength(25)]
        public string? Category { get; set; }

        [Column("company_id")] // <--- Keep Column attribute for DB mapping
        public int? CompanyId { get; set; } // <--- RENAME to camelCase

        [Column("worker_id")] // <--- Keep Column attribute for DB mapping
        public int? WorkerId { get; set; } // <--- RENAME to camelCase

        [Column("parts_id")] // <--- Keep Column attribute for DB mapping
        public int? PartsId { get; set; } // <--- RENAME to camelCase

        [Column("date_started")] // <--- Keep Column attribute for DB mapping
        public DateTime? DateStarted { get; set; } // <--- RENAME to camelCase

        [Column("date_finished")] // <--- Keep Column attribute for DB mapping
        public DateTime? DateFinished { get; set; } // <--- RENAME to camelCase

        [Column("motive_rescheduled")] // <--- Keep Column attribute for DB mapping
        [StringLength(150, ErrorMessage = "Motive Reschedule cannot exceed 150 characters.")]
        public string? MotiveRescheduled { get; set; } // <--- RENAME to camelCase

        [Column("description")] // <--- Keep Column attribute for DB mapping
        [StringLength(150, ErrorMessage = "Description cannot exceed 150 characters.")]
        public string? Description { get; set; } // <--- RENAME to camelCase

        [Column("status_id")] // <--- Keep Column attribute for DB mapping
        public int? StatusId { get; set; } // <--- RENAME to camelCase

        [Column("machine_id")] // <--- Keep Column attribute for DB mapping
        public int? MachineId { get; set; } // <--- RENAME to camelCase

        [Column("client_signature")] // <--- Keep Column attribute for DB mapping
        [StringLength(150, ErrorMessage = "Client signature cannot exceed 150 characters.")]
        public string? ClientSignature { get; set; } // <--- RENAME to camelCase

        [Column("created_date")] // <--- Keep Column attribute for DB mapping
        public DateTime? CreatedDate { get; set; } // <--- RENAME to camelCase

        [Column("modified_date")] // <--- Keep Column attribute for DB mapping
        public DateTime? ModifiedDate { get; set; } // <--- RENAME to camelCase

        // Navigation properties (if they exist in your Service model)
        public Company? Company { get; set; } // Make sure this exists if you are including it
        public Parts? Parts { get; set; } // Make sure this exists if you are including it
        public Status? Status { get; set; } // Assuming a Status model

        public Machine? Machine { get; set; } // Assuming a Machine model, if it existsr { get; set; }
    }
}