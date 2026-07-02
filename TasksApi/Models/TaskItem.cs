using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TasksApi.Models;

// Priority serializes as "Low" / "Medium" / "High" to match the Angular Task model.
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Priority
{
    Low,
    Medium,
    High
}

// A single Task resource.
public class TaskItem
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Title is required.")]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool Completed { get; set; }

    public Priority Priority { get; set; } = Priority.Medium;

    public DateTime? DueDate { get; set; }

    public DateTime CreatedAt { get; set; }
}
