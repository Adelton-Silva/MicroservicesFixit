using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceManagementService.Models
{
    [Table("machine_mods")]
    public class Machine_mod
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("model")]
        public string? Model { get; set; }

        [ForeignKey("Machine_type_id")]
        public int? machine_type_id { get; set; }
        //public Machine_type Machine_type { get; set; }

        [Column("created_date")]
        public DateTime? Created_date { get; set; }

        [Column("modified_date")]
        public DateTime? Modified_date { get; set; }

    }
}