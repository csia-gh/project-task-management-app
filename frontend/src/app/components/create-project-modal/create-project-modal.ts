import { Component, EventEmitter, Output, signal, ViewChild } from '@angular/core';
import { CreateAndUpdateProjectDto } from '../../models/project.model';
import { Modal } from '../modal/modal';
import { ProjectForm } from '../project-form/project-form';

@Component({
  selector: 'app-create-project-modal',
  imports: [Modal, ProjectForm],
  templateUrl: './create-project-modal.html',
})
export class CreateProjectModal {
  @Output() projectCreated = new EventEmitter<CreateAndUpdateProjectDto>();
  @ViewChild('modal') modal!: Modal;

  projectForm: CreateAndUpdateProjectDto = {
    name: '',
    description: '',
  };

  isOpen = signal(false);

  get canSubmit(): boolean {
    return !!this.projectForm.name?.trim();
  }

  open() {
    this.isOpen.set(true);
    this.modal.open();
  }

  onSubmit(): void {
    if (this.canSubmit) {
      this.projectCreated.emit({ ...this.projectForm });
      this.modal.close();
      this.resetForm();
    }
  }

  onCancel(): void {
    this.modal.close();
    this.resetForm();
  }

  private resetForm(): void {
    this.projectForm = { name: '', description: '' };
    this.isOpen.set(false);
  }
}
