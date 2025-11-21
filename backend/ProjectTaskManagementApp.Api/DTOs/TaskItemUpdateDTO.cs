using ProjectTaskManagementApp.Api.Data.Entities;
using System.ComponentModel.DataAnnotations;

namespace ProjectTaskManagementApp.Api.DTOs
{
    public class TaskItemUpdateDTO
    {
        [Required]
        [MaxLength(150)]
        public required string Title { get; set; }

        public string? Description { get; set; }

        public TaskItemStatus Status { get; set; }

        public DateTime? DueDate { get; set; }
    }
}
