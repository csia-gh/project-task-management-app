import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Project, ProjectDetailModel } from '../models/project.model';
import { catchError, Observable } from 'rxjs';
import { TaskItem } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseService<Project> {
  constructor(http: HttpClient) {
    super(http, 'projects');
  }

  override getById(id: string): Observable<ProjectDetailModel> {
    return this.http
      .get<ProjectDetailModel>(`${this.baseUrl}/${this.endpoint}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getProjectTasks(projectId: string): Observable<TaskItem[]> {
    return this.http
      .get<TaskItem[]>(`${this.baseUrl}/projects/${projectId}/tasks`)
      .pipe(catchError(this.handleError));
  }

  // GET /api/projects/{projectId}/tasks?status=Done
  getProjectTasksByStatus(projectId: string, status: string): Observable<TaskItem[]> {
    return this.http
      .get<TaskItem[]>(`${this.baseUrl}/projects/${projectId}/tasks?status=${status}`)
      .pipe(catchError(this.handleError));
  }
}
