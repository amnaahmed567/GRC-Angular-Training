// Detail page for a single task — creates (/tasks/new) or edits (/tasks/:id).
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
})
export class TaskDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly taskService = inject(TaskService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  // true on /tasks/new (create), false on /tasks/:id (edit).
  readonly isNew = signal(false);

  // The id from the URL (edit mode only), converted from string to number.
  private taskId: number | null = null;

  // The form is described here in the class (reactive forms).
  // priority starts empty so the user must actively pick one (required).
  form = this.fb.group({ //form group is a collection of form controls, which can be nested.
    title: ['', [Validators.required, Validators.maxLength(100)]],
    priority: ['', Validators.required],
    completed: [false],
  });

  ngOnInit(): void {
    // Route params (:id) arrive as strings. /tasks/new has no :id → create mode.
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam === null) {
      this.isNew.set(true);
      this.loading.set(false);
      return;
    }

    // Edit mode — convert the id to a number and load the task.
    this.taskId = Number(idParam);
    this.taskService.getTask(this.taskId).subscribe({
      next: (task) => {
        // Fill the form with the loaded values.
        this.form.patchValue({
          title: task.title,
          priority: task.priority,
          completed: task.completed,
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Could not load this task.');
        this.loading.set(false);
        console.error('Failed to load task', err);
      },
    });
  }

  // Create or update the task, then go back to the list.
  save(): void {
    if (this.form.invalid) return; // never trust the client alone — the API validates too

    this.saving.set(true);
    const value = this.form.getRawValue();
    const base = {
      title: value.title!.trim(),
      priority: value.priority as Task['priority'],
      completed: value.completed!,
    };

    // POST a new task, or PUT the existing one.
    const request$ = this.isNew()
      ? this.taskService.addTask(base)
      : this.taskService.updateTask({ id: this.taskId!, ...base });

    request$.subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: (err) => {
        this.error.set('Could not save the task. Please try again.');
        this.saving.set(false);
        console.error('Failed to save task', err);
      },
    });
  }
}
