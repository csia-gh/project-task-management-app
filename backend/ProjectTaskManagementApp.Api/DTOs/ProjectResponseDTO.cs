namespace ProjectTaskManagementApp.Api.DTOs
{
    public class ProjectResponseDTO
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
