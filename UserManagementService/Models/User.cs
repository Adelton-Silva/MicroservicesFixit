/*using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UserManagementService.Models
{
    public class User
    {
        [BsonId] // Define o campo como sendo o identificador
        public ObjectId Id { get; set; } // Altere para ObjectId

        [BsonElement("username")]
        public string Username { get; set; }

        [BsonElement("password")]
        public string Password { get; set; }

        [BsonElement("email")]
        public string Email { get; set; }
    }
}
*/

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UserManagementService.Models
{
    public class User
    {
        [BsonId] // Define o campo como sendo o identificador~
        [BsonElement("_id")] 
        [BsonRepresentation(BsonType.Int32)] // Define que o ID será do tipo int no MongoDB
        public int Id { get; set; } // Alterado para int

        [BsonElement("username")]
        [StringLength(20), ErrorMessage("Username must be between 5 and 20 characters.")]
        public string Username { get; set; } = null!;

        [BsonElement("password")]
        [StringLength(30, MinimumLength = 5), ErrorMessage("Password must be between 5 and 30 characters.")]
        public string Password { get; set; } = null!;

        [BsonElement("email")]
        [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$", ErrorMessage = "Email is not valid")]
        public string Email { get; set; } = null!;
    }
}


