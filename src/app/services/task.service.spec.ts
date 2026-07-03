// Unit tests for the TaskService (HTTP calls).
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TaskService } from './task.service';
import { Task, Priority } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5170/api/tasks';

  beforeEach(() => {
    TestBed.configureTestingModule({
      // provideHttpClientTesting swaps the real backend for a controllable mock.
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify()); // no unexpected requests left over

  it('adds a task via POST and returns the created task', () => {
    const newTask = { title: 'Write tests', completed: false, priority: Priority.High };
    let created: Task | undefined;

    // act
    service.addTask(newTask).subscribe((task) => (created = task));

    // assert the request
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);

    // simulate the server response
    req.flush({ id: 1, ...newTask });
    expect(created?.id).toBe(1);
  });
});
