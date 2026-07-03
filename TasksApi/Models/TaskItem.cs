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
    [StringLength(100, ErrorMessage = "Title must be 100 characters or fewer.")]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool Completed { get; set; }

    // Nullable + [Required] so omitting the priority fails validation (400),
    // and [EnumDataType] rejects values outside Low/Medium/High.
    [Required(ErrorMessage = "Priority is required.")]
    [EnumDataType(typeof(Priority), ErrorMessage = "Priority must be Low, Medium, or High.")]
    public Priority? Priority { get; set; }

    public DateTime? DueDate { get; set; }

    public DateTime CreatedAt { get; set; }
}
