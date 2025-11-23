export enum TaskStatus {
  Todo = 'Todo',
  InProgress = 'InProgress',
  Done = 'Done',
}

export type TaskFilterStatus = TaskStatus | 'All';

export enum TaskFilterStatusEnum {
  Todo = 'Todo',
  InProgress = 'InProgress',
  Done = 'Done',
  All = 'All',
}

export const STATUS_LABELS: Record<TaskFilterStatus, string> = {
  [TaskStatus.Todo]: 'To Do',
  [TaskStatus.InProgress]: 'In Progress',
  [TaskStatus.Done]: 'Done',
  All: 'All',
};

export const TASK_FILTER_STATUSES: TaskFilterStatus[] = [
  'All',
  TaskStatus.Todo,
  TaskStatus.InProgress,
  TaskStatus.Done,
];
