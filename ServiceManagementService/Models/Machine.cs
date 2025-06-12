using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ServiceManagementService.Models
{
    [Table("machines")]
    public class Machine
    {
        [Column("id")]
        public int Id { get; set; }

        [ForeignKey("company_id")]
        public int? Company_id { get; set; }

        [Column("serial_number")]    
        public string? serial_number { get; set; }

        [Column("type")]    
        public string? type { get; set; }

        [Column("brand")]    
        public string? brand { get; set; }

        [Column("model")]    
        public string? model { get; set; }

        [Column("number_hours")]    
        public int? number_hours { get; set; }
        
        [Column("last_maintenance_date")]
        public DateTime? last_maintenance_date { get; set; }

        [Column("isActive")]
        public int? Isactive { get; set; }

        [Column("created_date")]
        public DateTime? created_date { get; set; }

        [Column("modified_date")]
        public DateTime? modified_date { get; set; }

    }
}