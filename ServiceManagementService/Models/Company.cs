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
        [StringLength(150, ErrorMessage = "Name cannot exceed 150 characters.")]
        public string? Name { get; set; }

        [Column("nif")]
        [Range(100000000, 999999999, ErrorMessage = "NIF must be a 9-digit number.")]
        public int? Nif { get; set; }

        [Column("address")]
        [StringLength(150, ErrorMessage = "Address cannot exceed 150 characters.")]
        public string? Address { get; set; }

        [Column("email")]
        [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$", ErrorMessage = "Email is not valid")]
        public string? Email { get; set; }

        [Column("phone")]
        [RegularExpression(@"^(2\d{8}|9[1236]\d{7})$", ErrorMessage = "Phone number is not valid")]
        public string? Phone { get; set; }

        [Column("postal_code")]
        [RegularExpression(@"^\d{4}-\d{3}$", ErrorMessage = "Postal code must be in the format 1234-567.")]
        public string? Postal_code { get; set; }

        [Column("location_reference")]
        [StringLength(250, ErrorMessage = "Location cannot exceed 250 characters.")]
        public string? Location_reference { get; set; }

        [Column("isActive")]
        [Range(0, 1, ErrorMessage = "IsActive must be either 0 (inactive) or 1 (active).")]
        public int? Isactive { get; set; } 
        
        [Column("created_date")]
        public DateTime? Created_date { get; set; }
        
        [Column("modified_date")]
        public DateTime? Modified_date { get; set; }
        
       
    }
}