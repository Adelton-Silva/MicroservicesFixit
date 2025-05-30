using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace UserManagementService.Models
{
    public class User
    {
        [BsonId] // Define o campo como sendo o identificador
        [BsonRepresentation(MongoDB.Bson.BsonType.Int32)] // Define que o ID será do tipo int no MongoDB
        public int Id { get; set; } // Alterado para int

        [BsonElement("username")]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = null!;

        [BsonElement("password")]
        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; } = null!;

        [BsonElement("email")]
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; } = null!;
    }
}


