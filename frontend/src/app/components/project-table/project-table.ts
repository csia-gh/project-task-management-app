import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-table',
  imports: [],
  templateUrl: './project-table.html',
})
export class ProjectTable {
  @Input() projects: Project[] = [];
  @Output() viewDetails = new EventEmitter<string>();
  @Output() deleteProject = new EventEmitter<Project>();

  onViewDetails(projectId: string): void {
    this.viewDetails.emit(projectId);
  }

  onDeleteProject(project: Project, event: Event): void {
    event.stopPropagation();
    this.deleteProject.emit(project);
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US');
  }
}
