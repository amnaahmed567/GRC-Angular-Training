// Parent component — loads tasks from the API and handles add/toggle/delete actions.
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskItem } from '../task-item/task-item';

@Component({
  selector: 'app-task-list',
  imports: [TaskItem, FormsModule, RouterLink],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly platformId = inject(PLATFORM_ID);

  // Signals drive the view. Setting a signal schedules change detection,
  // so the list updates on the first click even in zoneless mode.
  readonly tasks = signal<Task[]>([]);
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  // Bound to the text box via [(ngModel)] — stays in sync as you type.
  newTitle = '';

  // Bound to the priority dropdown in the add-task form.
  newPriority: Task['priority'] = 'Medium';

  ngOnInit(): void {
    // Only fetch in the browser — skip during server-side rendering.
    if (isPlatformBrowser(this.platformId)) {
      this.loadTasks();
    }
  }

  // GET the list and push it into the tasks signal.
  loadTasks(): void {
    this.error.set(null);
    this.loading.set(true);
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Could not load tasks. Please try again.');
        this.loading.set(false);
        console.error('Failed to load tasks', err);
      },
    });
  }

  // POST a new task, then reload the list.
  addTask(form?: NgForm): void {
    const title = this.newTitle.trim();
    if (!title) return; // ignore empty input

    this.taskService.addTask({ title, completed: false, priority: this.newPriority }).subscribe({
      next: () => {
        this.newTitle = '';
        this.newPriority = 'Medium';
        // Reset validation state so the cleared field doesn't flash an error.
        form?.resetForm({ priority: 'Medium' });
        this.loadTasks();
      },
      error: (err) => {
        this.error.set('Could not add the task. Please try again.');
        console.error('Failed to add task', err);
      },
    });
  }

  // PATCH the toggle endpoint, then reload the list.
  onToggle(id: number): void {
    this.taskService.toggleTask(id).subscribe({
      next: () => this.loadTasks(),
      error: (err) => {
        this.error.set('Could not update the task. Please try again.');
        console.error('Failed to toggle task', err);
      },
    });
  }

  // DELETE the task, then reload the list.
  onDelete(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
      error: (err) => {
        this.error.set('Could not delete the task. Please try again.');
        console.error('Failed to delete task', err);
      },
    });
  }
}
