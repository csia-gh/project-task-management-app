import { Injectable, signal, computed } from '@angular/core';

/**
 * EDIT STATE MANAGER
 * Ensures that ONLY 1 thing is in edit mode at a time
 */

export type EditableEntityType = 'project' | 'task';

export interface EditState {
  type: EditableEntityType;
  id: string;
}

@Injectable()
export class EditStateService {
  private readonly _currentEdit = signal<EditState | null>(null);

  readonly currentEdit = this._currentEdit.asReadonly();

  isEditing(type: EditableEntityType, id: string): boolean {
    const current = this._currentEdit();
    return current?.type === type && current?.id === id;
  }

  isEditingSignal(type: EditableEntityType, id: string) {
    return computed(() => this.isEditing(type, id));
  }

  startEdit(type: EditableEntityType, id: string) {
    this._currentEdit.set({ type, id });
  }

  cancelEdit(type: EditableEntityType, id: string) {
    const current = this._currentEdit();
    if (current?.type === type && current?.id === id) {
      this._currentEdit.set(null);
    }
  }

  cancelAnyEdit() {
    this._currentEdit.set(null);
  }

  hasActiveEdit(): boolean {
    return this._currentEdit() !== null;
  }
}
