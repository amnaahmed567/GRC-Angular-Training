// Shared Task data model used across the task-list and task-item components.

// Priority is a string enum so the values ('Low'/'Medium'/'High') match the
// backend Priority enum exactly when sent as JSON.
export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
}
