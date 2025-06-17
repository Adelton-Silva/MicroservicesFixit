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
        public int? Service_id { get; set; }

        [Column("client_id")]
        public int? Client_id { get; set; }

        [Column("review_text")]
        [StringLength(250, ErrorMessage = "Review text cannot exceed 250 characters.")]
        public string? Review_text { get; set; }

        [Column("review_star")]
        [Range(1, 5, ErrorMessage = "Review star must be between 1 and 5.")]
        public int? Review_star { get; set; }

        [Column("created_date")]
        public DateTime? Created_date { get; set; }

        [Column("modified_date")]
        public DateTime? Modified_date { get; set; }
    }
}
