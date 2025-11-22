import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { TaskItem } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService extends BaseService<TaskItem> {
  constructor(http: HttpClient) {
    super(http, 'taskitems');
  }
}
