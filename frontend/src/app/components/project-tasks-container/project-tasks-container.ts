import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectDetailModel } from '../../models/project.model';
import { TASK_FILTER_STATUSES, TaskFilterStatus } from '../../models/task-status.enum';
import { TaskItem, UpdateTaskDto } from '../../models/task.model';
import { ProjectDetailFacade } from '../../pages/project-detail/project-detail.facade';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';
import { TaskListItem } from '../task-list-item/task-list-item';

@Component({
  selector: 'app-project-tasks-container',
  imports: [TaskListItem, FormsModule, StatusLabelPipe],
  templateUrl: './project-tasks-container.html',
})
export class ProjectTasksContainer {
  @Input({ required: true }) project!: ProjectDetailModel;

  private readonly facade = inject(ProjectDetailFacade);

  protected readonly statuses = TASK_FILTER_STATUSES;
  readonly currentFilter = this.facade.filterStatus;

  @Output() createTaskClicked = new EventEmitter<void>();
  @Output() deleteTaskClicked = new EventEmitter<TaskItem>();
  @Output() editTaskStarted = new EventEmitter<string>();
  @Output() editTaskCancelled = new EventEmitter<string>();
  @Output() taskSaved = new EventEmitter<{ taskId: string; dto: UpdateTaskDto }>();

  isTaskEditing(taskId: string): boolean {
    return this.facade.isEditingTask(taskId);
  }

  onStatusFilterChange(status: TaskFilterStatus) {
    this.facade.changeFilterStatus(status as TaskFilterStatus);
  }
}
