/**
 * DAY 1 — TypeScript Exercises
 * ----------------------------------------------------------------------------
 * Five small exercises covering the core TypeScript building blocks you'll use
 * all week: interface, generics, enum, class (with access modifiers), and
 * putting them together. Nothing here touches the UI — it's pure TypeScript
 * practice. You can run it with:  npx tsx src/app/day1-typescript-exercises.ts
 */

// 1. INTERFACE — describes the shape of an object (this becomes your data model)
export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High'; // a union type: only these 3 values allowed
}

// 2. GENERIC FUNCTION — reusable code that works with ANY type <T>
export function first<T>(items: T[]): T | undefined {
  return items[0];
}

// 3. ENUM — a fixed, named set of values
export enum Status {
  Todo = 'TODO',
  InProgress = 'IN_PROGRESS',
  Done = 'DONE',
}

// 4. CLASS with access modifiers — groups data + behavior, controls access
export class TaskList {
  // `private` = only usable inside this class
  private tasks: Task[] = [];

  add(task: Task): void {
    this.tasks.push(task);
  }

  // `public` is the default; shown here for clarity
  public count(): number {
    return this.tasks.length;
  }

  getCompleted(): Task[] {
    return this.tasks.filter((t) => t.completed);
  }
}

// 5. PUTTING IT ALL TOGETHER
const myTasks: Task[] = [
  { id: 1, title: 'Learn TypeScript', completed: true, priority: 'High' },
  { id: 2, title: 'Run the Angular app', completed: false, priority: 'Medium' },
];

const list = new TaskList();
myTasks.forEach((t) => list.add(t));

console.log('First task title:', first(myTasks)?.title); // generic in action
console.log('Total tasks:', list.count()); // class method
console.log('Completed tasks:', list.getCompleted().length);
console.log('A status value:', Status.InProgress); // enum
