import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateProjectModal } from '../../components/create-project-modal/create-project-modal';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { ProjectTable } from '../../components/project-table/project-table';
import { CreateAndUpdateProjectDto, Project } from '../../models/project.model';
import { SortColumn, SortDirection } from '../../models/sort.model';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-list',
  imports: [LoadingSpinner, ProjectTable, CreateProjectModal],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList implements OnInit {
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  @ViewChild(CreateProjectModal) createModal!: CreateProjectModal;

  allProjects = signal<Project[]>([]);
  isLoading = signal(true);

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
        // createdAt
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
      // Toggle direction
      this.sortDirection.set(
        this.sortDirection() === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
      );
    } else {
      // New column, default to asc
      this.sortColumn.set(column);
      this.sortDirection.set(SortDirection.Asc);
    }
  }

  openCreateModal() {
    this.createModal.open();
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

  deleteProject(project: Project) {
    if (confirm(`Are you sure you want to delete project "${project.name}"?`)) {
      this.projectService.delete(project.id).subscribe({
        next: () => {
          this.allProjects.update((p) => p.filter((pr) => pr.id !== project.id));
          this.toastr.success('Project deleted successfully!', 'Success');
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
