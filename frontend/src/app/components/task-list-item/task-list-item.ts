import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskStatus } from '../../models/task-status.enum';
import { TaskItem } from '../../models/task.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-list-item',
  imports: [DatePipe],
  templateUrl: './task-list-item.html',
})
export class TaskListItem {
  @Input({ required: true }) task!: TaskItem;

  @Output() editTask = new EventEmitter<TaskItem>();
  @Output() deleteTask = new EventEmitter<TaskItem>();

  protected readonly TaskStatus = TaskStatus;

  onEdit() {
    this.editTask.emit(this.task);
  }

  onDelete() {
    this.deleteTask.emit(this.task);
  }
}
