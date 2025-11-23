import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { TaskStatus } from '../../models/task-status.enum';
import { TaskItem, UpdateTaskDto } from '../../models/task.model';
import { DatePipe, NgClass } from '@angular/common';
import { TaskFormFields } from '../task-form-fields/task-form-fields';
import { FormsModule } from '@angular/forms';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';
import { StatusBadgeClassPipe } from '../../pipes/status-badge-class.pipe';

@Component({
  selector: 'app-task-list-item',
  imports: [DatePipe, TaskFormFields, FormsModule, StatusLabelPipe, StatusBadgeClassPipe, NgClass],
  templateUrl: './task-list-item.html',
  styleUrl: './task-list-item.css',
})
export class TaskListItem {
  @Input({ required: true }) task!: TaskItem;
  @Output() editTask = new EventEmitter<{ taskId: string; dto: UpdateTaskDto }>();
  @Output() deleteTask = new EventEmitter<TaskItem>();

  isEditing = signal(false);
  editTaskDto = signal<UpdateTaskDto | null>(null);
  isSaving = signal(false);

  protected readonly TaskStatus = TaskStatus;

  onEdit() {
    const formatDate = (dateStr: string | Date | undefined): string | undefined => {
      if (!dateStr) return undefined;
      try {
        const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
        return date.toISOString().split('T')[0];
      } catch {
        return undefined;
      }
    };

    this.editTaskDto.set({
      title: this.task.title,
      description: this.task.description,
      status: this.task.status,
      dueDate: formatDate(this.task.dueDate),
    });

    this.isEditing.set(true);
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

    this.editTask.emit({
      taskId: this.task.id,
      dto: cleanDto,
    });
    this.isEditing.set(false);
  }

  onCancelEdit() {
    this.isEditing.set(false);
  }

  onDelete() {
    this.deleteTask.emit(this.task);
  }
}
