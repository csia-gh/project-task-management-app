import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateProjectModal } from '../../components/create-project-modal/create-project-modal';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { ProjectTable } from '../../components/project-table/project-table';
import { CreateAndUpdateProjectDto, Project } from '../../models/project.model';
import { SortColumn, SortDirection } from '../../models/sort.model';
import { ProjectService } from '../../services/project.service';
import { ModalService } from '../../services/modal.service';
import { ConfirmationModal } from '../../components/confirmation-modal/confirmation-modal';
import { ModalIds } from '../../constants/modal-ids.constant';

@Component({
  selector: 'app-project-list',
  imports: [LoadingSpinner, ProjectTable, CreateProjectModal, ConfirmationModal],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList implements OnInit {
  private projectService = inject(ProjectService);
  public modalService = inject(ModalService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  protected readonly ModalIds = ModalIds;

  allProjects = signal<Project[]>([]);
  isLoading = signal(true);
  projectToDelete = signal<Project | null>(null);
  deleteMessage = computed(() => {
    const project = this.projectToDelete();
    if (!project) {
      return 'The selected project could not be identified.';
    }
    return `Are you sure you want to delete project '${project.name}'? All associated tasks will be lost!`;
  });

  sortColumn = signal<SortColumn>(SortColumn.Name);
  sortDirection = signal<SortDirection>(SortDirection.Asc);

  sortedProjects = computed(() => {
    const projects = [...this.allProjects()];
    const column = this.sortColumn();
    const direction = this.sortDirection();

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

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.isLoading.set(true);
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.allProjects.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.toastr.error(error, 'Error');
        this.isLoading.set(false);
      },
    });
  }

  onSort(column: SortColumn) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(
        this.sortDirection() === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
      );
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set(SortDirection.Asc);
    }
  }

  onProjectCreated(dto: CreateAndUpdateProjectDto) {
    this.projectService.create(dto).subscribe({
      next: (newProject) => {
        this.allProjects.update((p) => [...p, newProject]);
        this.toastr.success('Project created successfully!', 'Success');
      },
      error: (error) => {
        this.toastr.error(error, 'Error');
      },
    });
  }

  initiateDelete(project: Project) {
    this.projectToDelete.set(project);
    this.modalService.open(this.ModalIds.DELETE_PROJECT);
  }

  onDeleteConfirmed() {
    const project = this.projectToDelete();

    if (project) {
      this.projectService.delete(project.id).subscribe({
        next: () => {
          this.allProjects.update((p) => p.filter((pr) => pr.id !== project.id));
          this.toastr.success('Project deleted successfully!', 'Success');
          this.projectToDelete.set(null);
        },
        error: (error) => {
          this.toastr.error(error, 'Error');
        },
      });
    }
  }

  viewProjectDetails(projectId: string) {
    this.router.navigate(['/projects', projectId]);
  }
}
