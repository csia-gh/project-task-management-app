import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../models/task-status.enum';

@Pipe({
  name: 'statusLabel',
  standalone: true,
  pure: true,
})
export class StatusLabelPipe implements PipeTransform {
  transform(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Todo:
        return 'To Do';
      case TaskStatus.InProgress:
        return 'In Progress';
      case TaskStatus.Done:
        return 'Done';
      default:
        return status;
    }
  }
}
