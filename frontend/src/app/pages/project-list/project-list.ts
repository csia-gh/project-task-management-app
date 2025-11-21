import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { ProjectTable } from '../../components/project-table/project-table';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-list',
  imports: [LoadingSpinner, ProjectTable],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList implements OnInit {
  projects = signal<Project[]>([]);
  isLoading = signal(true);

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
