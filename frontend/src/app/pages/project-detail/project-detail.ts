import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateTaskModal } from '../../components/create-task-modal/create-task-modal';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { ProjectDataCard } from '../../components/project-data-card/project-data-card';
import { ProjectTasksContainer } from '../../components/project-tasks-container/project-tasks-container';
import { ModalIds } from '../../constants/modal-ids.constant';
import { CreateAndUpdateProjectDto } from '../../models/project.model';
import { CreateTaskDto, TaskItem, UpdateTaskDto } from '../../models/task.model';
import { ConfirmationModal } from '../../components/confirmation-modal/confirmation-modal';
import { ProjectDetailFacade } from './project-detail.facade';
import { EditStateService } from '../../services/edit-state.service';

@Component({
  selector: 'app-project-detail',
  imports: [
    LoadingSpinner,
    ProjectDataCard,
    ProjectTasksContainer,
    CreateTaskModal,
    ConfirmationModal,
  ],
  providers: [ProjectDetailFacade, EditStateService],
  templateUrl: './project-detail.html',
})
export class ProjectDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);
  private readonly facade = inject(ProjectDetailFacade);

  readonly project = this.facade.project;
  readonly isLoading = this.facade.isLoading;
  readonly isEditingProject = this.facade.isEditingProject;
  readonly tasks = this.facade.tasks;

  protected readonly ModalIds = ModalIds;

  // Local UI state (form data)
  projectForm: CreateAndUpdateProjectDto = {
    name: '',
    description: '',
  };

  get canSave(): boolean {
    return !!this.projectForm.name?.trim();
  }

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');

    if (projectId) {
      this.facade.loadProject(projectId);
    } else {
      this.toastr.error('Project ID not found!', 'Error');
    }
  }

  // project actions
  startEditingProject() {
    const proj = this.project();
    if (proj) {
      this.projectForm = {
        name: proj.name,
        description: proj.description || '',
      };
      this.facade.startEditingProject();
    }
  }

  saveProject() {
    if (this.canSave) {
      this.facade.saveProject(this.projectForm);
    }
  }

  cancelEditing() {
    this.facade.cancelEditingProject();
  }

  // task actions
  openCreateTaskModal() {
    this.facade.openCreateTaskModal();
  }

  onCreateTaskConfirmed(dto: CreateTaskDto) {
    this.facade.createTask(dto);
  }

  onDeleteTaskRequest(task: TaskItem) {
    this.facade.requestDeleteTask(task);
  }

  onDeleteTaskConfirmed() {
    this.facade.confirmDeleteTask();
  }

  onTaskEditStarted(taskId: string) {
    this.facade.startEditingTask(taskId);
  }

  onTaskSaved(event: { taskId: string; dto: UpdateTaskDto }) {
    this.facade.saveTask(event.taskId, event.dto);
  }

  onTaskEditCancelled(taskId: string) {
    this.facade.cancelEditingTask(taskId);
  }

  deleteTaskMessage = (): string => {
    return this.facade.deleteTaskMessage();
  };
}
