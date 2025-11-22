import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { CreateAndUpdateProjectDto } from '../../models/project.model';
import { ModalService } from '../../services/modal.service';
import { Modal } from '../modal/modal';
import { FormsModule, NgForm } from '@angular/forms';
import { ProjectFormFields } from '../project-form-fields/project-form-fields';
import { ModalIds } from '../../constants/modal-ids.constant';

@Component({
  selector: 'app-create-project-modal',
  imports: [Modal, FormsModule, ProjectFormFields],
  templateUrl: './create-project-modal.html',
})
export class CreateProjectModal {
  @Output() projectCreated = new EventEmitter<CreateAndUpdateProjectDto>();

  private modalService = inject(ModalService);
  protected readonly ModalIds = ModalIds;

  @ViewChild('projectFormElement') form?: NgForm;

  projectForm: CreateAndUpdateProjectDto = {
    name: '',
    description: '',
  };

  get canSubmit(): boolean {
    return !!this.projectForm.name?.trim();
  }

  onSubmit() {
    if (this.canSubmit) {
      this.projectCreated.emit({ ...this.projectForm });
      this.modalService.close(this.ModalIds.CREATE_PROJECT);
      this.resetForm();
    }
  }

  onCancel() {
    this.modalService.close(this.ModalIds.CREATE_PROJECT);
    this.resetForm();
  }

  private resetForm() {
    const emptyForm = { name: '', description: '' };

    if (this.form) {
      this.form.resetForm(emptyForm);
    }

    this.projectForm = emptyForm;
  }
}
