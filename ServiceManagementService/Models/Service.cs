using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceManagementService.Models
{
    [Table("services")]
    public class Service
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("appointment_id")]
        public int? Appointment_id { get; set; }

        [Column("worker_id")]
        public int? Worker_id { get; set; }
       
        
        [Column("parts_id")]
        public int? Parts_id { get; set; }
        
        [Column("date_started")]
        public DateOnly? Date_started { get; set; }
        
        [Column("date_finished")]
        public DateOnly? Date_finished { get; set; }
        
        [Column("motive_rescheduled")]
        public string? Motive_rescheduled { get; set; }
        
        [Column("client_signature")]
        public string? Status_id { get; set; }
        
        [Column("created_date")]
        public DateTime? Created_date { get; set; }
        
        [Column("modified_date")]
        public DateTime? Modified_date { get; set; }
        
       
    }
}