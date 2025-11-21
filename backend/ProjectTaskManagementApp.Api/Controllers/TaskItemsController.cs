using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectTaskManagementApp.Api.Data;
using ProjectTaskManagementApp.Api.Data.Entities;
using ProjectTaskManagementApp.Api.DTOs;

namespace ProjectTaskManagementApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TaskItemsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/TaskItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTaskItems()
        {
            return await _context.TaskItems.ToListAsync();
        }

        // GET: api/TaskItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItemResponseDTO>> GetTaskItem(Guid id)
        {
            var taskItem = await _context.TaskItems.FindAsync(id);

            if (taskItem == null)
            {
                return NotFound();
            }

            var responseDTO = new TaskItemResponseDTO
            {
                Id = taskItem.Id,
                Title = taskItem.Title,
                Description = taskItem.Description,
                Status = taskItem.Status,
                DueDate = taskItem.DueDate,
                CreatedAt = taskItem.CreatedAt,
                ProjectId = taskItem.ProjectId
            };

            return responseDTO;
        }

        // PUT: api/TaskItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTaskItem(Guid id, TaskItem taskItem)
        {
            if (id != taskItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(taskItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TaskItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TaskItemResponseDTO>> PostTaskItem(TaskItemCreateDTO taskItemDTO)
        {
            var projectExists = await _context.Projects
                .AnyAsync(p => p.Id == taskItemDTO.ProjectId);

            if (!projectExists)
            {
                return NotFound($"Project with ID {taskItemDTO.ProjectId} not found.");
            }

            var taskItem = new TaskItem()
            {
                Title = taskItemDTO.Title,
                Description = string.IsNullOrWhiteSpace(taskItemDTO.Description)
                    ? null
                    : taskItemDTO.Description, 
                DueDate = taskItemDTO.DueDate,
                ProjectId = taskItemDTO.ProjectId
            };

            _context.TaskItems.Add(taskItem);
            await _context.SaveChangesAsync();

            var responseDTO = new TaskItemResponseDTO
            {
                Id = taskItem.Id,
                Title = taskItem.Title,
                Description = taskItem.Description,
                Status = taskItem.Status,
                DueDate = taskItem.DueDate,
                CreatedAt = taskItem.CreatedAt,
                ProjectId = taskItem.ProjectId
            };

            return CreatedAtAction(nameof(GetTaskItem), new { id = taskItem.Id }, responseDTO);
        }

        // DELETE: api/TaskItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaskItem(Guid id)
        {
            var taskItem = await _context.TaskItems.FindAsync(id);
            if (taskItem == null)
            {
                return NotFound();
            }

            _context.TaskItems.Remove(taskItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TaskItemExists(Guid id)
        {
            return _context.TaskItems.Any(e => e.Id == id);
        }
    }
}
