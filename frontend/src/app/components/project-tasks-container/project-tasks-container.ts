import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectDetailModel } from '../../models/project.model';

@Component({
  selector: 'app-project-tasks-container',
  imports: [],
  templateUrl: './project-tasks-container.html',
})
export class ProjectTasksContainer {
  @Input({ required: true }) project!: ProjectDetailModel;

  @Output() createTaskClicked = new EventEmitter<void>();
}
