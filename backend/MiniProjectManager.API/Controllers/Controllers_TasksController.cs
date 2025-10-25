using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniProjectManager.API.DTOs.Tasks;
using MiniProjectManager.API.Services.Interfaces;

namespace MiniProjectManager.API.Controllers
{
    [ApiController]
    [Route("api")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userIdClaim!);
        }

        [HttpPost("projects/{projectId}/tasks")]
        public async Task<ActionResult<TaskResponseDto>> CreateTask(Guid projectId, [FromBody] CreateTaskDto createDto)
        {
            try
            {
                var userId = GetUserId();
                var task = await _taskService.CreateTask(projectId, createDto, userId);
                return CreatedAtAction(nameof(CreateTask), new { projectId, id = task.Id }, task);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("tasks/{taskId}")]
        public async Task<ActionResult<TaskResponseDto>> UpdateTask(Guid taskId, [FromBody] UpdateTaskDto updateDto)
        {
            try
            {
                var userId = GetUserId();
                var task = await _taskService.UpdateTask(taskId, updateDto, userId);
                return Ok(task);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("tasks/{taskId}")]
        public async Task<ActionResult> DeleteTask(Guid taskId)
        {
            try
            {
                var userId = GetUserId();
                await _taskService.DeleteTask(taskId, userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpGet("projects/{projectId}/tasks")]
public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetProjectTasks(Guid projectId)
{
    try
    {
        var userId = GetUserId();
        var tasks = await _taskService.GetProjectTasks(projectId, userId);
        return Ok(tasks);
    }
    catch (Exception ex)
    {
        return NotFound(new { message = ex.Message });
    }
}

    }
}
