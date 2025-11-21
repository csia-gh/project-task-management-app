export enum TaskStatus {
  Todo = 'Todo',
  InProgress = 'InProgress',
  Done = 'Done',
}

export function getStatusLabel(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.Todo:
      return 'To Do';
    case TaskStatus.InProgress:
      return 'In Progress';
    case TaskStatus.Done:
      return 'Done';
    default:
      return status;
  }
}

export function getStatusBadgeClass(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.Todo:
      return 'bg-secondary';
    case TaskStatus.InProgress:
      return 'bg-primary';
    case TaskStatus.Done:
      return 'bg-success';
    default:
      return 'bg-secondary';
  }
}
