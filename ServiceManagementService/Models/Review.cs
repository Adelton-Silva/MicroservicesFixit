using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ServiceManagementService.Models
{
    [Table("reviews")]
    public class Review
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("service_id")]
        [Required]
        public int? Service_id { get; set; }

        [Column("client_id")]
        [Required]
        public int? Client_id { get; set; }

        [Column("review_text")]
        [Required]
        public string? Review_text { get; set; }
        
        [Column("review_star")]
        public int? Review_star { get; set; }
        
        [Column("created_date")]
        public DateTime? Created_date { get; set; }
        
        [Column("modified_date")]
        public DateTime? Modified_date { get; set; }
        
       
    }
}