import { TaskStatus } from './task-status.enum';

export interface TaskItem {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date | string;
  createdAt: Date | string;
}

export interface CreateTaskDto {
  projectId: string;
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
}
