import { TaskFilterStatus, TaskFilterStatusEnum } from './../../models/task-status.enum';
import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { CreateAndUpdateProjectDto } from '../../models/project.model';
import { CreateTaskDto, TaskItem, UpdateTaskDto } from '../../models/task.model';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { ModalService } from '../../services/modal.service';
import { ModalIds } from '../../constants/modal-ids.constant';
import { ProjectStore } from '../../stores/project.store';
import { EditStateService } from '../../services/edit-state.service';

@Injectable()
export class ProjectDetailFacade implements OnDestroy {
  private readonly projectService = inject(ProjectService);
  private readonly taskService = inject(TaskService);
  private readonly modalService = inject(ModalService);
  private readonly toastr = inject(ToastrService);
  private readonly titleService = inject(Title);
  private readonly store = inject(ProjectStore);
  private readonly editState = inject(EditStateService);
  private readonly destroy$ = new Subject<void>();

  private readonly _isLoading = signal(false);
  private readonly _taskToDelete = signal<TaskItem | null>(null);
  private readonly _filterStatus = signal<TaskFilterStatus>('All');
  readonly filterStatus = this._filterStatus.asReadonly();

  readonly isLoading = this._isLoading.asReadonly();
  readonly taskToDelete = this._taskToDelete.asReadonly();
  readonly project = this.store.selectedProject;
  readonly tasks = this.store.selectedProjectTasks;

  readonly editState$ = this.editState;

  readonly deleteTaskMessage = computed(() => {
    const taskTitle = this._taskToDelete()?.title;
    return `Are you sure you want to delete task '${taskTitle}'?`;
  });

  isEditingProject = computed(() => {
    const project = this.store.selectedProject();
    return project ? this.editState.isEditing('project', project.id) : false;
  });

  isEditingTask(taskId: string): boolean {
    return this.editState.isEditing('task', taskId);
  }

  // proj actions
  loadProject(projectId: string) {
    this._isLoading.set(true);

    this.projectService
      .getById(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.store.setSelectedProject(data);
          this._isLoading.set(false);
          this.titleService.setTitle(`${data.name} | Project & Task Manager`);
        },
        error: (error) => {
          this.toastr.error(error, 'Error loading project');
          this._isLoading.set(false);
        },
      });
  }

  startEditingProject() {
    const project = this.store.selectedProject();
    if (!project) return;

    this.editState.startEdit('project', project.id);
  }

  cancelEditingProject() {
    const project = this.store.selectedProject();
    if (!project) return;

    this.editState.cancelEdit('project', project.id);
  }

  saveProject(dto: CreateAndUpdateProjectDto) {
    const project = this.store.selectedProject();
    if (!project) return;

    this.projectService
      .update(project.id, dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.store.updateSelectedProject(updated);
          this.editState.cancelEdit('project', project.id);
          this.titleService.setTitle(`${updated.name} | Project & Task Manager`);
          this.toastr.success('Project updated!');
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }

  // task actions
  refreshSelectedProjectTasks(projectId: string, status: TaskFilterStatus): void {
    this.projectService
      .getProjectTasks(projectId, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.store.setSelectedProjectTasks(tasks);
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }

  openCreateTaskModal() {
    this.editState.cancelAnyEdit();
    if (this.store.selectedProject()) {
      this.modalService.open(ModalIds.CREATE_TASK);
    }
  }

  createTask(dto: CreateTaskDto) {
    this.taskService
      .create(dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newTask) => {
          if (
            newTask.status === this._filterStatus() ||
            this._filterStatus() === TaskFilterStatusEnum.All
          ) {
            this.store.addTaskToSelectedProjectTasks(newTask);
          }
          this.toastr.success(`Task '${newTask.title}' created!`);
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }

  startEditingTask(taskId: string) {
    this.editState.startEdit('task', taskId);
  }

  cancelEditingTask(taskId: string) {
    this.editState.cancelEdit('task', taskId);
  }

  saveTask(taskId: string, dto: UpdateTaskDto) {
    this.taskService
      .update(taskId, dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          if (
            updated.status === this._filterStatus() ||
            this._filterStatus() === TaskFilterStatusEnum.All
          ) {
            this.store.updateTaskInSelected(taskId, updated);
          } else {
            this.store.removeTaskFromSelected(taskId);
          }
          this.editState.cancelEdit('task', taskId);
          this.toastr.success('Task updated!');
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }

  requestDeleteTask(task: TaskItem) {
    this.editState.cancelAnyEdit();
    this._taskToDelete.set(task);
    this.modalService.open(ModalIds.DELETE_TASK_CONFIRMATION);
  }

  confirmDeleteTask() {
    const task = this._taskToDelete();
    if (!task) return;

    this.taskService
      .delete(task.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.store.removeTaskFromSelected(task.id);
          this.toastr.success(`Task '${task.title}' deleted!`);
          this._taskToDelete.set(null);
        },
        error: (error) => {
          this.toastr.error(error);
          this._taskToDelete.set(null);
        },
      });
  }

  changeFilterStatus(status: TaskFilterStatus): void {
    this.editState.cancelAnyEdit();
    this._filterStatus.set(status);
    const projectId = this.store.selectedProject()?.id;
    if (projectId) {
      this.refreshSelectedProjectTasks(projectId, status);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.editState.cancelAnyEdit();
  }
}
