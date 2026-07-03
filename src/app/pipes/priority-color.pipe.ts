// Custom pipe — turns a task priority into a colored dot for display.
// Keeps this formatting out of the component logic.
import { Pipe, PipeTransform } from '@angular/core';
import { Priority } from '../models/task.model';

@Pipe({ name: 'priorityColor' }) // standalone is the default in modern Angular
export class PriorityColorPipe implements PipeTransform {
  transform(p: Priority | string): string {
    switch (p) {
      case Priority.High:
        return '🔴';
      case Priority.Medium:
        return '🟡';
      case Priority.Low:
        return '🟢';
      default:
        return '⚪';
    }
  }
}
