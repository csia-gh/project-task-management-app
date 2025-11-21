using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectTaskManagementApp.Api.Data;
using ProjectTaskManagementApp.Api.Data.Entities;
using ProjectTaskManagementApp.Api.DTOs;

namespace ProjectTaskManagementApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectResponseDTO>>> GetProjects()
        {
            var projects = await _context.Projects
                .Select(p => new ProjectResponseDTO
                 {
                   Id = p.Id,
                   Name = p.Name,
                   Description = p.Description,
                   CreatedAt = p.CreatedAt
                })
                .ToListAsync();

            return Ok(projects);
        }

        // GET: api/Projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDetailResponseDTO>> GetProject(Guid id)
        {
            var project = await _context.Projects
                .Include(p => p.TaskItems)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
            {
                return NotFound();
            }

            var responseDTO = new ProjectDetailResponseDTO
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                CreatedAt = project.CreatedAt,
                TaskItems = project.TaskItems.Select(t => new TaskItemResponseDTO
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    DueDate = t.DueDate,
                    CreatedAt = t.CreatedAt,
                    ProjectId = t.ProjectId
                }).ToList()
            };

            return responseDTO;
        }

        // PUT: api/Projects/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProject(Guid id, ProjectCreateUpdateDTO projectDTO)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
            {
                return NotFound();
            }

            project.Name = projectDTO.Name;
            project.Description = string.IsNullOrWhiteSpace(projectDTO.Description)
                ? null
                : projectDTO.Description;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!ProjectExists(id))
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/Projects
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProjectResponseDTO>> PostProject(ProjectCreateUpdateDTO projectDTO)
        {
            var project = new Project
            {
                Name = projectDTO.Name,
                Description = string.IsNullOrWhiteSpace(projectDTO.Description)
                    ? null
                    : projectDTO.Description
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            var responseDTO = new ProjectResponseDTO
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                CreatedAt = project.CreatedAt
            };

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, responseDTO);
        }

        // DELETE: api/Projects/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(Guid id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectExists(Guid id)
        {
            return _context.Projects.Any(e => e.Id == id);
        }
    }
}
