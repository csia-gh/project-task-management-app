import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Project } from '../models/project.model';
import { Observable } from 'rxjs';
import { TaskItem } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseService<Project> {
  constructor(http: HttpClient) {
    super(http, 'projects');
  }

  getProjectTasks(projectId: string): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(`${this.baseUrl}/projects/${projectId}/tasks`);
  }

  // GET /api/projects/{projectId}/tasks?status=Done
  getProjectTasksByStatus(projectId: string, status: string): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(
      `${this.baseUrl}/projects/${projectId}/tasks?status=${status}`
    );
  }
}
