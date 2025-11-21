import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-success-message',
  imports: [],
  templateUrl: './success-message.html',
})
export class SuccessMessage {
  @Input() message: string = '';
  @Output() messageChange = new EventEmitter<string>();

  onClose(): void {
    this.message = '';
    this.messageChange.emit('');
  }
}
