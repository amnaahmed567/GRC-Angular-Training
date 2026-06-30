import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskItem } from '../task-item/task-item';

@Component({
  selector: 'app-task-list',
  imports: [TaskItem, FormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  // Local state held in a signal (sample data for now)
  readonly tasks = signal<Task[]>([
    { id: 1, title: 'Learn Angular components', completed: true, priority: 'High' },
    { id: 2, title: 'Build the task list', completed: false, priority: 'Medium' },
    { id: 3, title: 'Style the task item', completed: false, priority: 'Low' },
  ]);

  // Bound to the text box via [(ngModel)] — stays in sync as you type
  newTitle = '';

  // Adds a new task from whatever is in the text box
  addTask(): void {
    const title = this.newTitle.trim();
    if (!title) return; // ignore empty input

    const nextId = Math.max(0, ...this.tasks().map((t) => t.id)) + 1;

    this.tasks.update((tasks) => [
      ...tasks,
      { id: nextId, title, completed: false, priority: 'Medium' },
    ]);

    this.newTitle = ''; // clear the box
  }

  // Runs when a child emits toggleComplete. Flips that task's "completed".
  onToggle(id: number): void {
    this.tasks.update((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }
}
