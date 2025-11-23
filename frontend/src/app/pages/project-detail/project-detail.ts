import { Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateTaskModal } from '../../components/create-task-modal/create-task-modal';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { ProjectDataCard } from '../../components/project-data-card/project-data-card';
import { ProjectTasksContainer } from '../../components/project-tasks-container/project-tasks-container';
import { ModalIds } from '../../constants/modal-ids.constant';
import { CreateAndUpdateProjectDto, ProjectDetailModel } from '../../models/project.model';
import { CreateTaskDto, TaskItem, UpdateTaskDto } from '../../models/task.model';
import { ModalService } from '../../services/modal.service';
import { ProjectService } from '../../services/project.service';
import { TaskService } from './../../services/task.service';
import { ConfirmationModal } from '../../components/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-project-detail',
  imports: [
    LoadingSpinner,
    ProjectDataCard,
    ProjectTasksContainer,
    CreateTaskModal,
    ConfirmationModal,
  ],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
})
export class ProjectDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private toastr = inject(ToastrService);
  private titleService = inject(Title);
  private taskService = inject(TaskService);
  private modalService = inject(ModalService);

  project = signal<ProjectDetailModel | null>(null);
  isLoading = signal(true);
  isEditingProject = signal(false);
  taskToEdit = signal<TaskItem | null>(null);
  taskToDelete = signal<TaskItem | null>(null);
  protected readonly ModalIds = ModalIds;

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

  openCreateTaskModal() {
    if (this.project()) {
      this.modalService.open(ModalIds.CREATE_TASK);
    }
  }

  onCreateTaskConfirmed(dto: CreateTaskDto) {
    this.taskService.create(dto).subscribe({
      next: (newTask: TaskItem) => {
        this.project.update((p) => {
          if (!p) return null;
          return {
            ...p,
            taskItems: [...(p.taskItems || []), newTask],
          };
        });
        this.toastr.success(`Task '${newTask.title}' created successfully!`, 'Success');
      },
      error: (error) => {
        this.toastr.error(error, 'Error');
      },
    });
  }

  onDeleteTaskRequest(task: TaskItem) {
    this.taskToDelete.set(task);
    this.modalService.open(this.ModalIds.DELETE_TASK_CONFIRMATION);
  }

  onDeleteTaskConfirmed() {
    const task = this.taskToDelete();

    if (!task || !this.project()) return;

    this.taskService.delete(task.id).subscribe({
      next: () => {
        this.project.update((p) => {
          if (!p) return null;
          return {
            ...p,
            taskItems: p.taskItems.filter((t) => t.id !== task.id),
          };
        });
        this.toastr.success(`Task '${task.title}' deleted successfully!`, 'Success');
        this.taskToDelete.set(null);
      },
      error: (error) => {
        this.toastr.error(error, 'Error');
        this.taskToDelete.set(null);
      },
    });
  }

  onTaskUpdated(event: { taskId: string; dto: UpdateTaskDto }) {
    this.taskService.update(event.taskId, event.dto).subscribe({
      next: (serverResponse: TaskItem) => {
        this.project.update((currentProject) => {
          if (!currentProject) return null;

          return {
            ...currentProject,
            taskItems: currentProject.taskItems.map((t) =>
              t.id === serverResponse.id ? serverResponse : t
            ),
          };
        });

        this.toastr.success(`Task updated!`, 'Success');
      },
      error: (error) => {
        this.toastr.error(error, 'Error');
      },
    });
  }

  deleteTaskMessage = () => {
    const taskTitle = this.taskToDelete()?.title;
    return `Are you sure you want to delete task '${taskTitle}'?`;
  };
}
