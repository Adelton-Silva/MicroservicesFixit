using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceManagementService.Models
{
    [Table("status")]
    public class Status
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("description")]
        public string? Description { get; set; }
        
        [Column("created_date")]
        public DateTime? Created_date { get; set; }
        
        [Column("modified_date")]
        public DateTime? Modified_date { get; set; }
        
       
    }
}