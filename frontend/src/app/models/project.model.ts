import { TaskItem } from './task.model';

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date | string;
}

export interface ProjectDetailModel extends Project {
  taskItems: TaskItem[];
}

export interface CreateAndUpdateProjectDto {
  name: string;
  description?: string;
}
