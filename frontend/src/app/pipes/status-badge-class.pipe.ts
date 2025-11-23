import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../models/task-status.enum';

@Pipe({
  name: 'statusBadgeClass',
  standalone: true,
  pure: true,
})
export class StatusBadgeClassPipe implements PipeTransform {
  transform(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Todo:
        return 'bg-secondary';
      case TaskStatus.InProgress:
        return 'bg-warning';
      case TaskStatus.Done:
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }
}
