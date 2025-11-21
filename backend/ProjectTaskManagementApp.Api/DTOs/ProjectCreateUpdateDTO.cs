using System.ComponentModel.DataAnnotations;

namespace ProjectTaskManagementApp.Api.DTOs
{
    public class ProjectCreateUpdateDTO
    {
        [Required]
        [MaxLength(100)]
        public required string Name { get; set; }

        public string? Description { get; set; }
    }
}
