import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
})
export class Modal {
  @Input({ required: true }) modalId!: string;

  open() {
    const modalElement = document.getElementById(this.modalId);
    if (!modalElement) return;

    const modal = new (window as any).bootstrap.Modal(modalElement);
    modalElement.addEventListener('hidden.bs.modal', this.handleModalHidden, { once: true });
    modal.show();
  }

  close() {
    const modalElement = document.getElementById(this.modalId);
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      (document.activeElement as HTMLElement)?.blur();
      modal.hide();
    }
  }

  private handleModalHidden = () => {
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach((backdrop) => backdrop.remove());

    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  };
}
