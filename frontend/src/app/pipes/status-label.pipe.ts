import { Pipe, PipeTransform } from '@angular/core';
import { STATUS_LABELS, TaskFilterStatus, TaskStatus } from '../models/task-status.enum';

@Pipe({
  name: 'statusLabel',
  standalone: true,
  pure: true,
})
export class StatusLabelPipe implements PipeTransform {
  transform(status: TaskFilterStatus): string {
    return STATUS_LABELS[status] || status;
  }
}
