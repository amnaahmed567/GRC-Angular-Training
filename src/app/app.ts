// Root component — hosts the task list and shows a Day 1 computed greeting.
import { Component, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Task Manager');

  // Day 1 — personalized greeting
  protected readonly userName = signal('Amna');

  // computed() derives state automatically when userName changes
  protected readonly greeting = computed(() => `Welcome back, ${this.userName()}! 👋`);
}
