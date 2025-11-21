import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { ProjectTable } from '../../components/project-table/project-table';
import { CreateProjectDto, Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { CreateProjectModal } from '../../components/create-project-modal/create-project-modal';

@Component({
  selector: 'app-project-list',
  imports: [LoadingSpinner, ProjectTable, FormsModule, CreateProjectModal],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList implements OnInit {
  @ViewChild(CreateProjectModal) createModal!: CreateProjectModal;
  projects = signal<Project[]>([]);
  isLoading = signal(true);

  projectForm = {
    name: '',
    description: '',
  };

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading.set(true);

    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.toastr.error(error, 'Error');
        this.isLoading.set(false);
      },
    });
  }

  openCreateModal(): void {
    this.createModal.open();
  }

  onProjectCreated(dto: CreateProjectDto): void {
    this.projectService.create(dto).subscribe({
      next: (newProject) => {
        this.projects.update((p) => [...p, newProject]);
        this.toastr.success('Project created successfully!', 'Success');

        const modal = document.getElementById('projectModal');
        const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
        bsModal?.hide();
      },
      error: (error) => {
        this.toastr.error(error, 'Error');
      },
    });
  }

  deleteProject(project: Project): void {
    if (confirm(`Are you sure you want to delete project "${project.name}"?`)) {
      this.projectService.delete(project.id).subscribe({
        next: () => {
          this.projects.update((p) => p.filter((pr) => pr.id !== project.id));
          this.toastr.success('Project deleted successfully!', 'Success');
        },
        error: (error) => {
          this.toastr.error(error, 'Error');
        },
      });
    }
  }

  viewProjectDetails(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }
}
