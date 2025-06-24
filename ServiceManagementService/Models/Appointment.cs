using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ServiceManagementService.Models
{
    [Table("appointments")]
    public class Appointment
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("title")]
        [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
        [Required]
        public string Title { get; set; } = string.Empty;

        [Column("client_id")]
        [Required]
        public int? Client_id { get; set; }

        [Column("machine_id")]
        [Required]
        public int? Machine_id { get; set; }

        [Column("status_id")]
        [Required]
        public int? Status_id { get; set; }

        [Column("date_appointment")]
        public DateOnly? Date_appointment { get; set; }

        [Column("date_conclusion")]
        public DateOnly? Date_conclusion { get; set; }

        [Column("created_date")]
        public DateTime? Created_date { get; set; }

        [Column("modified_date")]
        public DateTime? Modified_date { get; set; }
    }
}
