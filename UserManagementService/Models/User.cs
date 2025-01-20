/*namespace UserManagementService.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username  { get; set; }
        public string Password { get; set; }
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

