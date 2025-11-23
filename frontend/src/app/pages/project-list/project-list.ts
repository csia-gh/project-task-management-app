import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CreateProjectModal } from '../../components/create-project-modal/create-project-modal';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { ProjectTable } from '../../components/project-table/project-table';
import { CreateAndUpdateProjectDto, Project } from '../../models/project.model';
import { SortColumn } from '../../models/sort.model';
import { ModalService } from '../../services/modal.service';
import { ConfirmationModal } from '../../components/confirmation-modal/confirmation-modal';
import { ModalIds } from '../../constants/modal-ids.constant';
import { ProjectListFacade } from './project-list.facade';

@Component({
  selector: 'app-project-list',
  imports: [LoadingSpinner, ProjectTable, CreateProjectModal, ConfirmationModal],
  providers: [ProjectListFacade],
  templateUrl: './project-list.html',
})
export class ProjectList implements OnInit, OnDestroy {
  private readonly facade = inject(ProjectListFacade);

  readonly modalService = inject(ModalService);

  readonly isLoading = this.facade.isLoading;
  readonly sortedProjects = this.facade.sortedProjects;
  readonly sortColumn = this.facade.sortColumn;
  readonly sortDirection = this.facade.sortDirection;
  readonly deleteMessage = this.facade.deleteMessage;

  protected readonly ModalIds = ModalIds;

  ngOnInit() {
    this.facade.loadProjects();
  }

  ngOnDestroy() {
    this.facade.cleanup();
  }

  onSort(column: SortColumn) {
    this.facade.changeSort(column);
  }

  onProjectCreated(dto: CreateAndUpdateProjectDto) {
    this.facade.createProject(dto);
  }

  initiateDelete(project: Project) {
    this.facade.initiateDeleteProject(project);
  }

  onDeleteConfirmed() {
    this.facade.confirmDeleteProject();
  }

  viewProjectDetails(projectId: string) {
    this.facade.navigateToProjectDetails(projectId);
  }
}
