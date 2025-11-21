using System.ComponentModel.DataAnnotations;

namespace ProjectTaskManagementApp.Api.DTOs
{
    public class TaskItemCreateDTO
    {
        [Required]
        [MaxLength(150)]
        public required string Title { get; set; }

        public string? Description { get; set; }

        public DateTime? DueDate { get; set; }

        [Required]
        public required Guid ProjectId { get; set; }
    }
}
