// ServiceManagementService/Models/WorkerDto.cs
using System.Text.Json.Serialization;
namespace ServiceManagementService.Models // <--- This is the namespace
{
    public class WorkerDto
    {
        public int Id { get; set; }

        [JsonPropertyName("username")]
        public string? Name { get; set; }
        public string? Email { get; set; }

    }
}