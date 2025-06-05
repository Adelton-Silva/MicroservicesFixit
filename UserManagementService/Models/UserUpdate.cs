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
    public class UserUpdate
    {
        [BsonElement("username")]
        public string? Username { get; set; } = null!;

        [BsonElement("password")]
        public string? Password { get; set; } = null!;

        [BsonElement("email")]
        public string? Email { get; set; } = null!;
    }
}


