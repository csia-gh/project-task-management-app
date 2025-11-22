import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateAndUpdateProjectDto, Project } from '../../models/project.model';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectFormFields } from '../project-form-fields/project-form-fields';

@Component({
  selector: 'app-project-data-card',
  imports: [DatePipe, FormsModule, ProjectFormFields],
  templateUrl: './project-data-card.html',
})
export class ProjectDataCard {
  @Input({ required: true }) project!: Project;
  @Input({ required: true }) isEditingProject!: boolean;
  @Input({ required: true }) projectForm!: CreateAndUpdateProjectDto;
  @Input({ required: true }) canSave!: boolean;

  @Output() editClicked = new EventEmitter<void>();
  @Output() saveClicked = new EventEmitter<void>();
  @Output() cancelClicked = new EventEmitter<void>();
}
