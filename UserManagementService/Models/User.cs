using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UserManagementService.Models
{
    public class User
    {
        [BsonId]
        [BsonElement("_id")]
        [BsonRepresentation(BsonType.Int32)]
        public int Id { get; set; }

        [BsonElement("username")]
        [StringLength(20, MinimumLength = 5, ErrorMessage = "Username must be between 5 and 20 characters.")]
        public string Username { get; set; } = null!;

        [BsonElement("password")]
        [StringLength(30, MinimumLength = 5, ErrorMessage = "Password must be between 5 and 30 characters.")]
        public string Password { get; set; } = null!;

        [BsonElement("email")]
        [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$", ErrorMessage = "Email is not valid")]
        public string Email { get; set; } = null!;
    }
}
