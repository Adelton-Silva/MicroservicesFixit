using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceManagementService.Models
{
    [Table("Parts")]
    public class Parts
    {
        [Column("id")]
        public int Id { get; set; }
        
        [Column("name")]
        public string? Name { get; set; }

        [Column("description")]
        public string? Description { get; set; }
       
    }
}