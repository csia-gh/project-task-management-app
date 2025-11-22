import { Component, inject, OnInit, signal } from '@angular/core';
import { Project } from '../../models/project.model';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-detail',
  imports: [LoadingSpinner, DatePipe],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
})
export class ProjectDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private toastr = inject(ToastrService);

  project = signal<Project | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');

    if (projectId) {
      this.loadProject(projectId);
    } else {
      this.toastr.error('Project ID not found!', 'Error');
      this.isLoading.set(false);
    }
  }

  loadProject(projectId: string) {
    this.isLoading.set(true);

    this.projectService.getById(projectId).subscribe({
      next: (data) => {
        this.project.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.toastr.error(error, 'Error');
        this.isLoading.set(false);
      },
    });
  }
}
