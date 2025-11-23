import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { TaskStatus } from '../../models/task-status.enum';
import { TaskItem, UpdateTaskDto } from '../../models/task.model';
import { DatePipe, NgClass } from '@angular/common';
import { TaskFormFields } from '../task-form-fields/task-form-fields';
import { FormsModule } from '@angular/forms';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';
import { StatusBadgeClassPipe } from '../../pipes/status-badge-class.pipe';
import { formatDate } from '../../utils/helpers';

@Component({
  selector: 'app-task-list-item',
  imports: [DatePipe, TaskFormFields, FormsModule, StatusLabelPipe, StatusBadgeClassPipe, NgClass],
  templateUrl: './task-list-item.html',
  styleUrl: './task-list-item.css',
})
export class TaskListItem {
  @Input({ required: true }) task!: TaskItem;
  @Input() isEditing = false;

  // task ids
  @Output() editStarted = new EventEmitter<string>();
  @Output() editCancelled = new EventEmitter<string>();

  @Output() saved = new EventEmitter<{ taskId: string; dto: UpdateTaskDto }>();
  @Output() deleteTask = new EventEmitter<TaskItem>();

  protected readonly TaskStatus = TaskStatus;

  editTaskDto = signal<UpdateTaskDto | null>(null);
  isSaving = signal(false);

  onEdit() {
    this.editTaskDto.set({
      title: this.task.title,
      description: this.task.description,
      status: this.task.status,
      dueDate: formatDate(this.task.dueDate),
    });

    this.editStarted.emit(this.task.id);
  }

  onSaveEdit() {
    const dto = this.editTaskDto();
    if (!dto || !dto.title?.trim()) {
      return;
    }

    const cleanDto: UpdateTaskDto = {
      title: dto.title.trim(),
      description: dto.description?.trim() || undefined,
      status: dto.status,
      dueDate: dto.dueDate,
    };

    this.isSaving.set(true);
    this.saved.emit({
      taskId: this.task.id,
      dto: cleanDto,
    });
  }

  onCancelEdit() {
    this.editCancelled.emit(this.task.id);
  }

  onDelete() {
    this.deleteTask.emit(this.task);
  }
}
