import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseService<Project> {
  constructor(http: HttpClient) {
    super(http, 'projects');
  }
}
