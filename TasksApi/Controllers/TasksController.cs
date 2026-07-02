using Microsoft.AspNetCore.Mvc;
using TasksApi.Models;

namespace TasksApi.Controllers;

[ApiController]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    // In-memory store. static so the data lives for the app's lifetime (resets on restart).
    private static readonly List<TaskItem> _tasks = new()
    {
        new TaskItem { Id = 1, Title = "Learn Angular services", Description = "Move logic into a service", Completed = true, Priority = Priority.High, CreatedAt = DateTime.UtcNow },
        new TaskItem { Id = 2, Title = "Build the task list", Description = "Render tasks in the UI", Completed = false, Priority = Priority.Medium, CreatedAt = DateTime.UtcNow },
        new TaskItem { Id = 3, Title = "Call the API with HttpClient", Description = "GET/POST/PUT/DELETE", Completed = false, Priority = Priority.Low, CreatedAt = DateTime.UtcNow },
    };
    private static int _nextId = 4;
    private static readonly object _lock = new();

    // GET /api/tasks — list all tasks
    [HttpGet]
    public ActionResult<IEnumerable<TaskItem>> GetAll() => Ok(_tasks);

    // GET /api/tasks/{id} — one task, 404 if missing
    [HttpGet("{id:int}")]
    public ActionResult<TaskItem> GetById(int id)
    {
        var task = _tasks.FirstOrDefault(t => t.Id == id);
        return task is null ? NotFound() : Ok(task);
    }

    // POST /api/tasks — create a task ([ApiController] returns 400 automatically if Title is missing)
    [HttpPost]
    public ActionResult<TaskItem> Create([FromBody] TaskItem input)
    {
        lock (_lock)
        {
            input.Id = _nextId++;
            input.CreatedAt = DateTime.UtcNow;
            _tasks.Add(input);
        }
        return CreatedAtAction(nameof(GetById), new { id = input.Id }, input);
    }

    // PUT /api/tasks/{id} — update a task
    [HttpPut("{id:int}")]
    public ActionResult<TaskItem> Update(int id, [FromBody] TaskItem input)
    {
        var task = _tasks.FirstOrDefault(t => t.Id == id);
        if (task is null) return NotFound();

        task.Title = input.Title;
        task.Description = input.Description;
        task.Completed = input.Completed;
        task.Priority = input.Priority;
        task.DueDate = input.DueDate;
        return Ok(task);
    }

    // PATCH /api/tasks/{id}/toggle — flip completed
    [HttpPatch("{id:int}/toggle")]
    public ActionResult<TaskItem> Toggle(int id)
    {
        var task = _tasks.FirstOrDefault(t => t.Id == id);
        if (task is null) return NotFound();

        task.Completed = !task.Completed;
        return Ok(task);
    }

    // DELETE /api/tasks/{id} — remove a task
    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        var task = _tasks.FirstOrDefault(t => t.Id == id);
        if (task is null) return NotFound();

        _tasks.Remove(task);
        return NoContent();
    }
}
