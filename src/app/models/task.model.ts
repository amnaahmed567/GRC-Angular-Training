export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
}
