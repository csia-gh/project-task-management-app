export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date | string;
}

export interface CreateAndUpdateProjectDto {
  name: string;
  description?: string;
}
