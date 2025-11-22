import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-confirmation-modal',
  imports: [Modal],
  templateUrl: './confirmation-modal.html',
})
export class ConfirmationModal {
  private modalService = inject(ModalService);

  @Input({ required: true }) modalID!: string;
  @Input() title: string = 'Are you sure?';
  @Input() message: string = 'This action cannot be undone.';
  @Input() confirmButtonText: string = 'Delete';
  @Input() confirmButtonClass: string = 'btn-danger';

  @Output() confirmed = new EventEmitter<void>();

  onConfirm() {
    this.confirmed.emit();
    this.modalService.close(this.modalID);
  }

  onCancel() {
    this.modalService.close(this.modalID);
  }
}
