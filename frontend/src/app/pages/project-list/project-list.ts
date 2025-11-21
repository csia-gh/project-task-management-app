import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project, CreateProjectDto } from '../../models/project.model';
import { ErrorMessage } from '../../components/error-message/error-message';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { ProjectTable } from '../../components/project-table/project-table';
import { SuccessMessage } from '../../components/success-message/success-message';

@Component({
  selector: 'app-project-list',
  imports: [ErrorMessage, SuccessMessage, LoadingSpinner, ProjectTable],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList implements OnInit {
  projects: Project[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  deleteProject(project: Project): void {
    if (confirm(`Are you sure you want to delete project "${project.name}"?`)) {
      this.projectService.delete(project.id).subscribe({
        next: () => {
          this.projects = this.projects.filter((p) => p.id !== project.id);
          this.successMessage = 'Project deleted successfully!';
          this.cdr.detectChanges();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = error;
          this.cdr.detectChanges();
          setTimeout(() => (this.errorMessage = ''), 5000);
        },
      });
    }
  }

  viewProjectDetails(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }
}
