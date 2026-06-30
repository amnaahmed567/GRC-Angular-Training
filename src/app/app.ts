import { Component, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskList } from './components/task-list/task-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TaskList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Task Manager');

  // Day 1 — personalized greeting
  protected readonly userName = signal('Amna');

  // computed() derives state automatically when userName changes
  protected readonly greeting = computed(() => `Welcome back, ${this.userName()}! 👋`);
}
