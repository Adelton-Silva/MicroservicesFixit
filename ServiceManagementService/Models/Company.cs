using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ServiceManagementService.Models
{
    [Table("companies")]
    public class Company
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        [Required]
        public string? Name { get; set; }

        [Column("nif")]
        [Required]
        public int? Nif { get; set; }

        [Column("address")]
        [Required]
        public string? Address { get; set; }

        [Column("email")]
        [Required]
        public string? Email { get; set; }

        [Column("phone")]
        [Required]
        public string? Phone { get; set; }

        [Column("postal_code")]
        [Required]
        public string? Postal_code { get; set; }
        
        [Column("location_reference")]
        public string? Location_reference { get; set; }

        [Column("isActive")]
        [Required]
        public int? Isactive { get; set; } 
        
        [Column("created_date")]
        public DateTime? Created_date { get; set; }
        
        [Column("modified_date")]
        public DateTime? Modified_date { get; set; }
        
       
    }
}