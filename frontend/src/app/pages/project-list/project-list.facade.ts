import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateAndUpdateProjectDto, Project } from '../../models/project.model';
import { SortColumn, SortDirection } from '../../models/sort.model';
import { ProjectService } from '../../services/project.service';
import { ModalService } from '../../services/modal.service';
import { ModalIds } from '../../constants/modal-ids.constant';
import { ProjectStore } from '../../stores/project.store';

@Injectable()
export class ProjectListFacade {
  private readonly projectService = inject(ProjectService);
  private readonly modalService = inject(ModalService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly store = inject(ProjectStore);

  private readonly _isLoading = signal(false);
  private readonly _projectToDelete = signal<Project | null>(null);
  private readonly _sortColumn = signal<SortColumn>(SortColumn.Name);
  private readonly _sortDirection = signal<SortDirection>(SortDirection.Asc);

  readonly isLoading = this._isLoading.asReadonly();
  readonly projectToDelete = this._projectToDelete.asReadonly();
  readonly sortColumn = this._sortColumn.asReadonly();
  readonly sortDirection = this._sortDirection.asReadonly();

  readonly projects = this.store.projects;

  readonly sortedProjects = computed(() => {
    const projects = [...this.store.projects()];
    const column = this._sortColumn();
    const direction = this._sortDirection();

    projects.sort((a, b) => {
      let comparison = 0;
      if (column === SortColumn.Name) {
        comparison = a.name.localeCompare(b.name);
      } else {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        comparison = dateA - dateB;
      }
      return direction === SortDirection.Asc ? comparison : -comparison;
    });

    return projects;
  });

  readonly deleteMessage = computed(() => {
    const project = this._projectToDelete();
    if (!project) {
      return 'The selected project could not be identified.';
    }
    return `Are you sure you want to delete project '${project.name}'? All associated tasks will be lost!`;
  });

  // ACTIONS
  loadProjects(): void {
    this._isLoading.set(true);

    this.projectService.getAll().subscribe({
      next: (data) => {
        this.store.setProjects(data);
        this._isLoading.set(false);
      },
      error: (error) => {
        this.toastr.error(error, 'Error loading projects');
        this._isLoading.set(false);
      },
    });
  }

  changeSort(column: SortColumn): void {
    if (this._sortColumn() === column) {
      this._sortDirection.set(
        this._sortDirection() === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
      );
    } else {
      this._sortColumn.set(column);
      this._sortDirection.set(SortDirection.Asc);
    }
  }

  createProject(dto: CreateAndUpdateProjectDto): void {
    this.projectService.create(dto).subscribe({
      next: (newProject) => {
        this.store.addProject(newProject);
        this.toastr.success('Project created successfully!', 'Success');
      },
      error: (error) => {
        this.toastr.error(error, 'Error creating project');
      },
    });
  }

  initiateDeleteProject(project: Project): void {
    this._projectToDelete.set(project);
    this.modalService.open(ModalIds.DELETE_PROJECT);
  }

  confirmDeleteProject(): void {
    const project = this._projectToDelete();

    if (!project) return;

    this.projectService.delete(project.id).subscribe({
      next: () => {
        this.store.removeProject(project.id);
        this.toastr.success('Project deleted successfully!', 'Success');
        this._projectToDelete.set(null);
      },
      error: (error) => {
        this.toastr.error(error, 'Error deleting project');
        this._projectToDelete.set(null);
      },
    });
  }

  navigateToProjectDetails(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }

  cleanup(): void {
    this._projectToDelete.set(null);
  }
}
