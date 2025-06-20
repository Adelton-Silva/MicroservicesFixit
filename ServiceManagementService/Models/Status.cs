using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ServiceManagementService.Models
{
    [Table("status")]
    public class Status
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("description")]
        [StringLength(150, ErrorMessage = "Description cannot exceed 150 characters.")]
        public string? Description { get; set; }
        
        [Column("created_date")]
        public DateTime? Created_date { get; set; }
        
        [Column("modified_date")]
        public DateTime? Modified_date { get; set; }
        
       
    }
}