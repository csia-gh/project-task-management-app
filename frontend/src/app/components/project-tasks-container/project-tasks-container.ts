import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ProjectDetailModel } from '../../models/project.model';
import { TaskListItem } from '../task-list-item/task-list-item';
import { TaskItem, UpdateTaskDto } from '../../models/task.model';
import { ProjectDetailFacade } from '../../pages/project-detail/project-detail.facade';

@Component({
  selector: 'app-project-tasks-container',
  imports: [TaskListItem],
  templateUrl: './project-tasks-container.html',
})
export class ProjectTasksContainer {
  @Input({ required: true }) project!: ProjectDetailModel;

  private readonly facade = inject(ProjectDetailFacade);

  @Output() createTaskClicked = new EventEmitter<void>();
  @Output() deleteTaskClicked = new EventEmitter<TaskItem>();
  @Output() editTaskStarted = new EventEmitter<string>();
  @Output() editTaskCancelled = new EventEmitter<string>();
  @Output() taskSaved = new EventEmitter<{ taskId: string; dto: UpdateTaskDto }>();

  isTaskEditing(taskId: string): boolean {
    return this.facade.isEditingTask(taskId);
  }
}
