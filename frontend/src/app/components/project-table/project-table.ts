import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../models/project.model';
import { CommonModule } from '@angular/common';
import { SortColumn, SortDirection } from '../../models/sort.model';

@Component({
  selector: 'app-project-table',
  imports: [CommonModule],
  templateUrl: './project-table.html',
  styleUrl: './project-table.css',
})
export class ProjectTable {
  @Input() projects: Project[] = [];
  @Input() sortColumn: SortColumn = SortColumn.Name;
  @Input() sortDirection: SortDirection = SortDirection.Asc;

  @Output() viewDetails = new EventEmitter<string>();
  @Output() deleteProject = new EventEmitter<Project>();
  @Output() sort = new EventEmitter<SortColumn>();

  SortColumn = SortColumn;
  SortDirection = SortDirection;

  onSort(column: SortColumn) {
    this.sort.emit(column);
  }

  onViewDetails(projectId: string) {
    this.viewDetails.emit(projectId);
  }

  onDeleteProject(project: Project, event: Event) {
    event.stopPropagation();
    this.deleteProject.emit(project);
  }
}
