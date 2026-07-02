// App route table — maps URL paths to components.
import { Routes } from '@angular/router';
import { TaskList } from './components/task-list/task-list';
import { TaskDetail } from './components/task-detail/task-detail';

export const routes: Routes = [
  // Default to the list page.
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  // /tasks — the task list
  { path: 'tasks', component: TaskList },
  // /tasks/new — create a task (must come before :id so 'new' isn't read as an id)
  { path: 'tasks/new', component: TaskDetail },
  // /tasks/:id — detail / edit for one task (:id arrives as a string)
  { path: 'tasks/:id', component: TaskDetail },
];
