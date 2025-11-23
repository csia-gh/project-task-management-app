import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Project, ProjectDetailModel } from '../models/project.model';
import { catchError, Observable } from 'rxjs';
import { TaskItem } from '../models/task.model';
import { TaskFilterStatus, TaskStatus } from '../models/task-status.enum';

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

  getProjectTasks(projectId: string, status: TaskFilterStatus = 'All'): Observable<TaskItem[]> {
    let url = `${this.baseUrl}/projects/${projectId}/tasks`;
    if (status !== 'All') {
      url += `?status=${status}`;
    }
    return this.http.get<TaskItem[]>(url).pipe(catchError(this.handleError));
  }
}
