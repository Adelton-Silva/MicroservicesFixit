using System;
using System.Text.Json.Serialization;

namespace ServiceManagementService.Dtos;

public class CreateServiceDto
{
    [JsonPropertyName("priority")]
    public string? Priority { get; set; }

    [JsonPropertyName("category")]
    public string? Category { get; set; }

    [JsonPropertyName("company_id")]
    public int? CompanyId { get; set; }

    [JsonPropertyName("worker_id")]
    public int? WorkerId { get; set; }

    [JsonPropertyName("parts_id")]
    public int? PartsId { get; set; }

    [JsonPropertyName("date_started")]
    public DateTime? DateStarted { get; set; }

    [JsonPropertyName("date_finished")]
    public DateTime? DateFinished { get; set; }

    [JsonPropertyName("motive_rescheduled")]
    public string? MotiveRescheduled { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("status_id")]
    public int? StatusId { get; set; }

    [JsonPropertyName("machine_id")]
    public int? MachineId { get; set; }

    [JsonPropertyName("client_signature")]
    public string? ClientSignature { get; set; }
}
