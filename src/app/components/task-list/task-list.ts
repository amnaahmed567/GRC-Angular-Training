// Parent component — loads tasks from the API and handles add/toggle/delete actions.
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Task, Priority } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskItem } from '../task-item/task-item';

@Component({
  selector: 'app-task-list',
  imports: [TaskItem, ReactiveFormsModule, RouterLink],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fb = inject(FormBuilder);

  // Signals drive the view. Setting a signal schedules change detection,
  // so the list updates on the first click even in zoneless mode.
  readonly tasks = signal<Task[]>([]);
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  // Reactive add form — same validators as the detail form, so the
  // max-length error actually surfaces (input isn't natively capped).
  readonly addForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    priority: ['', Validators.required],
  });

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
  addTask(): void {
    if (this.addForm.invalid) return; // need a valid title and a chosen priority

    const value = this.addForm.getRawValue();
    const title = value.title!.trim();
    const priority = value.priority as Priority;

    this.taskService.addTask({ title, completed: false, priority }).subscribe({
      next: () => {
        // Reset values and validation state so nothing flashes an error.
        this.addForm.reset({ title: '', priority: '' });
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
