import { Component, Input } from '@angular/core';
import { CreateTaskDto, UpdateTaskDto } from '../../models/task.model';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';
import { TaskStatus } from '../../models/task-status.enum';

@Component({
  selector: 'app-task-form-fields',
  imports: [FormsModule, StatusLabelPipe],
  templateUrl: './task-form-fields.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class TaskFormFields {
  @Input() formData!: CreateTaskDto | UpdateTaskDto;
  @Input({ required: true }) showStatus: boolean = false;

  protected readonly TaskStatus = TaskStatus;

  public get updateData(): UpdateTaskDto {
    return this.formData as UpdateTaskDto;
  }
}
