import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ModalIds } from '../../constants/modal-ids.constant';
import { CreateTaskDto } from '../../models/task.model';
import { ModalService } from '../../services/modal.service';
import { Modal } from '../modal/modal';
import { TaskFormFields } from '../task-form-fields/task-form-fields';

@Component({
  selector: 'app-create-task-modal',
  imports: [Modal, FormsModule, TaskFormFields],
  templateUrl: './create-task-modal.html',
})
export class CreateTaskModal {
  @Output() taskCreated = new EventEmitter<CreateTaskDto>();
  @ViewChild('taskFormElement') form?: NgForm;
  @Input({ required: true }) projectId!: string;

  private modalService = inject(ModalService);
  protected readonly ModalIds = ModalIds;

  createTaskDto: CreateTaskDto = this.getEmptyDto();

  onSubmit(): void {
    if (this.form?.valid) {
      const finalDto: CreateTaskDto = {
        ...this.createTaskDto,
        projectId: this.projectId,
      };

      this.taskCreated.emit(finalDto);
      this.modalService.close(ModalIds.CREATE_TASK);
      this.resetForm();
    }
  }

  onCancel(): void {
    this.modalService.close(ModalIds.CREATE_TASK);
    this.resetForm();
  }

  private resetForm(): void {
    const emptyForm = this.getEmptyDto();
    this.form?.resetForm(emptyForm);
    this.createTaskDto = emptyForm;
  }

  private getEmptyDto(): CreateTaskDto {
    return {
      projectId: this.projectId || '',
      title: '',
      description: undefined,
      dueDate: undefined,
    };
  }
}
