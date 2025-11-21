import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-message',
  imports: [],
  templateUrl: './error-message.html',
})
export class ErrorMessage {
  @Input() message: string = '';
  @Output() messageChange = new EventEmitter<string>();

  onClose(): void {
    this.message = '';
    this.messageChange.emit('');
  }
}
