using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceManagementService.Models
{
    [Table("machines")]
    public class Machine
    {
        [Column("id")]
        public int Id { get; set; }

        [ForeignKey("company_id")]
        public int? Company_id { get; set; }    

        [ForeignKey("machine_mod_id")]
        public int? Machine_mod_id { get; set; }

        [Column("serial_number")]    
        public string? Serial_number { get; set; }

        [Column("number_hours")]    
        public int? Number_hours { get; set; }
        
        [Column("last_maintenance_date")]
        public DateTime? Last_maintenance_date { get; set; }

        [Column("isActive")]
        public int? IsActive { get; set; }

        [Column("created_date")]
        public DateTime? Created_date { get; set; }

        [Column("modified_date")]
        public DateTime? Modified_date { get; set; }

    }
}