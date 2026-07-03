// Unit tests for the TaskItem component.
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TaskItem } from './task-item';
import { Task, Priority } from '../../models/task.model';

describe('TaskItem', () => {
  let component: TaskItem;
  let fixture: ComponentFixture<TaskItem>;

  const task: Task = { id: 7, title: 'Sample', completed: false, priority: Priority.Low };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItem],
      providers: [provideRouter([])], // the template uses routerLink
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItem);
    component = fixture.componentInstance;
    // required input — set it before change detection runs
    fixture.componentRef.setInput('task', task);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits deleteTask with the task id when Delete is clicked', () => {
    let emittedId: number | undefined;
    component.deleteTask.subscribe((id) => (emittedId = id));

    const deleteBtn = fixture.nativeElement.querySelector('button.delete') as HTMLButtonElement;
    deleteBtn.click();

    expect(emittedId).toBe(task.id);
  });
});
