using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ServiceManagementService.Models
{
    [Table("services")]
    public class Service
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("appointment_id")]
        [Required]
        public int? Appointment_id { get; set; }

        [Column("worker_id")]
        public int? Worker_id { get; set; }

        [Column("parts_id")]
        public int? Parts_id { get; set; }

        [Column("date_started")]
        [Required]
        public DateOnly? Date_started { get; set; }

        [Column("date_finished")]
        public DateOnly? Date_finished { get; set; }

        [Column("motive_rescheduled")]
        public string? Motive_rescheduled { get; set; }

        [Column("Status_id")]
        public int? Status_id { get; set; }

        [Column("client_signature")]
        public string? Client_signature { get; set; }

        [Column("created_date")]
        public DateTime? Created_date { get; set; }

        [Column("modified_date")]
        public DateTime? Modified_date { get; set; }

        // >>>>> Adiciona o ForeignKey
        [ForeignKey("Appointment_id")]
        public Appointment? Appointment { get; set; }

        // >>>>> Adiciona o ForeignKey
        [ForeignKey("Parts_id")]
        public Parts? Parts { get; set; }

        // >>>>> Adiciona o ForeignKey
        [ForeignKey("Status_id")]
        public Status? Status { get; set; }
    }
}
