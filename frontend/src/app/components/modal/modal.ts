import {
  Component,
  Input,
  OnInit,
  ElementRef,
  OnDestroy,
  inject,
  signal,
  effect,
} from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
})
export class Modal implements OnInit, OnDestroy {
  @Input({ required: true }) modalID!: string;

  public modalService = inject(ModalService);
  private el = inject(ElementRef);

  isDisplayed = signal(false);
  isShow = signal(false);

  constructor() {
    effect(() => {
      const shouldBeOpen = this.modalService.isOpenSignal(this.modalID)();

      if (shouldBeOpen) {
        this.openWithAnimation();
      } else {
        this.closeWithAnimation();
      }
    });
  }

  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.el.nativeElement.parentNode) {
      document.body.removeChild(this.el.nativeElement);
    }
  }

  closeModal() {
    this.modalService.close(this.modalID);
  }

  private openWithAnimation() {
    this.isDisplayed.set(true);

    setTimeout(() => {
      this.isShow.set(true);
    }, 50);
  }

  private closeWithAnimation() {
    this.isShow.set(false);

    setTimeout(() => {
      this.isDisplayed.set(false);
    }, 300);
  }
}
