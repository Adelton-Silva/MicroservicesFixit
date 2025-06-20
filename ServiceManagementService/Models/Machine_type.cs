using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ServiceManagementService.Models
{
    [Table("machine_types")]
    public class Machine_type
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("description")]
        [StringLength(150, ErrorMessage = "Description cannot exceed 150 characters.")]
        public string? Description { get; set; }

        [Column("isActive")]
        [Range(0, 1, ErrorMessage = "IsActive must be either 0 (inactive) or 1 (active).")]
        public int? Isactive { get; set; }

        [Column("created_date")]
        public DateTime? Created_date { get; set; }

        [Column("modified_date")]
        public DateTime? Modified_date { get; set; }

        // Propriedade de navegação inversa
        //public ICollection<Machine_mod> Machine_mods { get; set; }
    }
}