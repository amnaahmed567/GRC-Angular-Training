// Talks to the backend Tasks API. Injectable app-wide via providedIn: 'root'.
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' //Create ONE shared instance of this service for the whole application.

 }) //This class is a service and can be injected into other classes.
//This is a service that should participate in Dependency Injection.
export class TaskService {
  private readonly http = inject(HttpClient); //

  // Base URL of the backend Tasks API (matches the http profile in launchSettings.json)
  private readonly apiUrl = 'http://localhost:5170/api/tasks';

  // GET  /api/tasks — fetch all tasks
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // GET  /api/tasks/:id — fetch one task
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  // POST /api/tasks — create a task (server assigns the id)
  addTask(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // PUT  /api/tasks/:id — update an existing task
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
  }

  // PATCH /api/tasks/:id/toggle — flip a task's completed flag
  toggleTask(id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/toggle`, {});
  }

  // DELETE /api/tasks/:id — remove a task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
