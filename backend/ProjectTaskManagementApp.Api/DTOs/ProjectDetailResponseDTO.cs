namespace ProjectTaskManagementApp.Api.DTOs
{
    public class ProjectDetailResponseDTO
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<TaskItemResponseDTO> TaskItems { get; set; } = new();
    }
}
