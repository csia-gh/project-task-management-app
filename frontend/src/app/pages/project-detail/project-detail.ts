import { Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { ProjectDataCard } from '../../components/project-data-card/project-data-card';
import { CreateAndUpdateProjectDto, Project, ProjectDetailModel } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { ProjectTasksContainer } from '../../components/project-tasks-container/project-tasks-container';

@Component({
  selector: 'app-project-detail',
  imports: [LoadingSpinner, ProjectDataCard, ProjectTasksContainer],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
})
export class ProjectDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private toastr = inject(ToastrService);
  private titleService = inject(Title);

  project = signal<ProjectDetailModel | null>(null);
  isLoading = signal(true);
  isEditingProject = signal(false);

  projectForm: CreateAndUpdateProjectDto = {
    name: '',
    description: '',
  };

  get canSave(): boolean {
    return !!this.projectForm.name?.trim();
  }

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
        this.titleService.setTitle(`${data.name} | Project & Task Manager`);
      },
      error: (error) => {
        this.toastr.error(error, 'Error');
        this.isLoading.set(false);
      },
    });
  }

  startEditingProject() {
    const proj = this.project();
    if (proj) {
      this.projectForm = {
        name: proj.name,
        description: proj.description || '',
      };
      this.isEditingProject.set(true);
    }
  }

  saveProject() {
    const proj = this.project();

    if (!proj || !this.canSave) {
      this.toastr.error('Project name is required!', 'Error');
      return;
    }

    const dto: CreateAndUpdateProjectDto = {
      name: this.projectForm.name.trim(),
      description: this.projectForm.description?.trim() || undefined,
    };

    this.projectService.update(proj.id, dto).subscribe({
      next: (updatedProject) => {
        this.project.update((currentProject) => {
          if (!currentProject) return null;

          return {
            ...currentProject,
            ...updatedProject,
          };
        });
        this.isEditingProject.set(false);
        this.titleService.setTitle(`${updatedProject.name} | Project & Task Manager`);
        this.toastr.success('Project updated successfully!', 'Success');
      },
      error: (error) => {
        this.toastr.error(error, 'Error');
      },
    });
  }

  cancelEditing() {
    this.isEditingProject.set(false);
  }

  onCreateTaskRequest() {
    console.log('New Task button clicked: Preparing to open modal.');
  }
}
