import { Component, input, output } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  imports: [],
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
})
export class TaskItem {
  // IN: the parent passes one task into this component (modern @Input)
  readonly task = input.required<Task>();

  // OUT: this component tells the parent "toggle this task" (modern @Output)
  readonly toggleComplete = output<number>();
}
