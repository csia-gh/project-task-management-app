import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CreateAndUpdateProjectDto } from '../../models/project.model';

@Component({
  selector: 'app-create-project-modal',
  imports: [FormsModule],
  templateUrl: './create-project-modal.html',
})
export class CreateProjectModal {
  @Output() projectCreated = new EventEmitter<CreateAndUpdateProjectDto>();
  @ViewChild('projectFormElement') form!: NgForm;

  projectForm: CreateAndUpdateProjectDto = {
    name: '',
    description: '',
  };

  open() {
    this.resetForm();
    const modalElement = document.getElementById('projectModal');
    if (!modalElement) return;

    const modal = new (window as any).bootstrap.Modal(modalElement);

    modalElement.addEventListener('hidden.bs.modal', this.handleModalHidden, { once: true });

    modal.show();
  }

  private handleModalHidden = () => {
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach((backdrop) => backdrop.remove());

    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  };

  closeModal() {
    const modalElement = document.getElementById('projectModal');
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
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
