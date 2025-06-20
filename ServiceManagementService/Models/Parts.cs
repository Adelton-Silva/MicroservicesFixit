using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ServiceManagementService.Models
{
    [Table("parts")]
    public class Parts
    {
        [Column("id")]
        public int Id { get; set; }
        
        [Column("name")]
        public string? Name { get; set; }

        [Column("description")]
        [StringLength(150, ErrorMessage = "Description cannot exceed 150 characters.")]
        public string? Description { get; set; }
       
    }
}