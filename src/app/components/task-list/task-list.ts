// Parent component — loads tasks from the API and handles add/toggle/delete actions.
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Observable, catchError, of } from 'rxjs';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskItem } from '../task-item/task-item';

@Component({
  selector: 'app-task-list',
  imports: [TaskItem, FormsModule, AsyncPipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly platformId = inject(PLATFORM_ID);

  // The $ suffix means 'this is an Observable'. The template reads it with the async pipe.
  tasks$!: Observable<Task[]>;

  // Simple error message shown if a request fails.
  error: string | null = null;

  // Bound to the text box via [(ngModel)] — stays in sync as you type
  newTitle = '';

  ngOnInit(): void {
    // Only fetch in the browser — skip during server-side rendering.
    if (isPlatformBrowser(this.platformId)) {
      this.loadTasks();
    }
  }

  // GET the list. catchError shows a message instead of breaking the stream.
  loadTasks(): void {
    this.error = null;
    this.tasks$ = this.taskService.getTasks().pipe(
      catchError((err) => {
        this.error = 'Could not load tasks. Please try again.';
        console.error('Failed to load tasks', err);
        return of([] as Task[]);
      })
    );
  }

  // POST a new task, then reload the list.
  addTask(): void {
    const title = this.newTitle.trim();
    if (!title) return; // ignore empty input

    this.taskService
      .addTask({ title, completed: false, priority: 'Medium' })
      .subscribe(() => {
        this.newTitle = '';
        this.loadTasks();
      });
  }

  // PATCH the toggle endpoint, then reload the list.
  onToggle(id: number): void {
    this.taskService.toggleTask(id).subscribe(() => this.loadTasks());
  }

  // DELETE the task, then reload the list.
  onDelete(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
  }
}
