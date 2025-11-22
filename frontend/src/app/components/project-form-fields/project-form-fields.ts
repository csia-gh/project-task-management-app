import { Component, Input, ViewChild } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { CreateAndUpdateProjectDto } from '../../models/project.model';

@Component({
  selector: 'app-project-form-fields',
  imports: [FormsModule],
  templateUrl: './project-form-fields.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class ProjectFormFields {
  @Input() formData: CreateAndUpdateProjectDto = {
    name: '',
    description: '',
  };
}
