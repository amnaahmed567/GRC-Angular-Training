// Child component — renders one task and emits a toggle event to its parent.
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  imports: [],
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
})
export class TaskItem {
  // IN: the parent passes one task into this component (@Input)
  @Input({ required: true }) task!: Task;

  // OUT: this component tells the parent "toggle this task" (@Output)
  @Output() toggleComplete = new EventEmitter<number>();

  // OUT: this component tells the parent "delete this task" (@Output)
  @Output() deleteTask = new EventEmitter<number>();
}
