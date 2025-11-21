using System.ComponentModel.DataAnnotations;

namespace ProjectTaskManagementApp.Api.Data.Entities
{
    public class Project
    {
        public Project()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
        }

        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public required string Name { get; set; }

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }

        public ICollection<TaskItem> TaskItems { get; set; } = new List<TaskItem>();
    }
}
