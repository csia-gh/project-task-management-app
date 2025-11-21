using System.ComponentModel.DataAnnotations;

namespace ProjectTaskManagementApp.Api.Data.Entities
{
    public enum TaskItemStatus
    {
        Todo,
        InProgress,
        Done
    }

    public class TaskItem
    {
        public TaskItem()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
        }

        [Key]
        public Guid Id { get; set; }

        public Guid ProjectId { get; set; }

        public Project Project { get; set; } = null!;

        [Required]
        [MaxLength(150)]
        public required string Title { get; set; }

        public string? Description { get; set; }

        public TaskItemStatus Status { get; set; } = TaskItemStatus.Todo;

        public DateTime? DueDate { get; set; }

        public DateTime CreatedAt { get; set; }

    }
}
