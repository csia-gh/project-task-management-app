using ProjectTaskManagementApp.Api.Data.Entities;

namespace ProjectTaskManagementApp.Api.DTOs
{
    public class TaskItemResponseDTO
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public TaskItemStatus Status { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid ProjectId { get; set; }
    }
}
