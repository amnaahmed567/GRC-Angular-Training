// Shared Task data model used across the task-list and task-item components.
export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
}
