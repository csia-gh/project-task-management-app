import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CreateProjectDto } from '../../models/project.model';

@Component({
  selector: 'app-create-project-modal',
  imports: [FormsModule],
  templateUrl: './create-project-modal.html',
})
export class CreateProjectModal {
  @Output() projectCreated = new EventEmitter<CreateProjectDto>();
  @ViewChild('projectFormElement') form!: NgForm;

  projectForm: CreateProjectDto = {
    name: '',
    description: '',
  };

  open() {
    this.resetForm();
    const modalElement = document.getElementById('projectModal');
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }

  closeModal() {
    const modalElement = document.getElementById('projectModal');
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    modal?.hide();

    const backdrop = document.querySelector('.modal-backdrop');
    backdrop?.remove();
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  }

  onSubmit() {
    if (this.form.valid && this.projectForm.name.trim()) {
      this.projectCreated.emit({ ...this.projectForm });
      this.closeModal();
      this.resetForm();
    }
  }

  resetForm(): void {
    this.projectForm = { name: '', description: '' };
    this.form?.resetForm();
  }
}
