using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceManagementService.Models
{
    [Table("machine_types")]
    public class Machine_type
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("isActive")]
        public int? IsActive { get; set; }

        [Column("created_date")]
        public DateTime? Created_date { get; set; }

        [Column("modified_date")]
        public DateTime? Modified_date { get; set; }

        // Propriedade de navegação inversa
        //public ICollection<Machine_mod> Machine_mods { get; set; }
    }
}