import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CreateAndUpdateProjectDto } from '../../models/project.model';

@Component({
  selector: 'app-project-form',
  imports: [FormsModule],
  templateUrl: './project-form.html',
})
export class ProjectForm {
  @Input() formData: CreateAndUpdateProjectDto = {
    name: '',
    description: '',
  };
}
