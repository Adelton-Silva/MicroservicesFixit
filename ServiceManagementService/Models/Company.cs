using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceManagementService.Models
{
    [Table("companies")]
    public class Company
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string? Name { get; set; }
        
        [Column("nif")]
        public int? Nif { get; set; }
        
        [Column("address")]
        public string? Address { get; set; }  
        
        [Column("email")]
        public string? Email { get; set; }
        
        [Column("phone")]
        public string? Phone { get; set; } 
        
        [Column("postal_code")]
        public string? Postal_code { get; set; }
        
        [Column("location_reference")]
        public string? Location_reference { get; set; }
        
        [Column("isActive")]
        public int? IsActive { get; set; } 
        
        [Column("created_date")]
        public DateTime? Created_date { get; set; }
        
        [Column("modified_date")]
        public DateTime? Modified_date { get; set; }
        
       
    }
}