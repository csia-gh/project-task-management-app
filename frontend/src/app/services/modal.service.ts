import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private openModals = signal<string[]>([]);

  isOpen(id: string) {
    return this.openModals().includes(id);
  }

  isOpenSignal(id: string) {
    return () => this.openModals().includes(id);
  }

  open(id: string) {
    this.openModals.update((ids) => [...ids, id]);
  }

  close(id: string) {
    this.openModals.update((ids) => ids.filter((x) => x !== id));
  }
}
