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
        [StringLength(150, ErrorMessage = "Serial number cannot exceed 150 characters.")]
        public string? serial_number { get; set; }

        [Column("type")]
        [StringLength(150, ErrorMessage = "Type cannot exceed 150 characters.")]
        public string? type { get; set; }

        [Column("brand")]
        [StringLength(150, ErrorMessage = "Brand cannot exceed 150 characters.")]
        public string? brand { get; set; }

        [Column("model")]
        [StringLength(150, ErrorMessage = "Model cannot exceed 150 characters.")]
        public string? model { get; set; }

        [Column("number_hours")]
        [Range(0, int.MaxValue, ErrorMessage = "Number of hours must be a non-negative integer.")]
        public int? number_hours { get; set; }

        [Column("last_maintenance_date")]
        public DateTime? last_maintenance_date { get; set; }

        [Column("isActive")]
        [Range(0, 1, ErrorMessage = "IsActive must be either 0 (inactive) or 1 (active).")]
        public int? Isactive { get; set; }

        [Column("created_date")]
        public DateTime? created_date { get; set; }

        [Column("modified_date")]
        public DateTime? modified_date { get; set; }

    }
}