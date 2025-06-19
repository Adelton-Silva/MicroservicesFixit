namespace ServiceManagementService.Dtos
{
    public class UpdateServiceDto
    {
        public string? Priority { get; set; }
        public string? Category { get; set; }
        public int? CompanyId { get; set; }
        public int? WorkerId { get; set; }
        public int? PartsId { get; set; }
        public DateTime? DateStarted { get; set; }
        public DateTime? DateFinished { get; set; }
        public string? MotiveRescheduled { get; set; }
        public string? Description { get; set; }
        public int? StatusId { get; set; }
        public int? MachineId { get; set; }
        public string? ClientSignature { get; set; }
    }
}
