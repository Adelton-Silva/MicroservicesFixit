using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceManagementService.Models
{
    [Table("appointments")]
    public class Appointment
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("client_id")]
        public int? Client_id { get; set; }

        [Column("machine_id")]
        public int? Machine_id { get; set; }
       
        
        [Column("status_id")]
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