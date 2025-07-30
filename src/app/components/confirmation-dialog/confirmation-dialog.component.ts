import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ConfirmationDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'success' | 'error' | 'warning' | 'info'; // nuovo campo

}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  @Input() isVisible = false;
  @Input() options!: ConfirmationDialogOptions;
  @Output() confirmed = new EventEmitter<boolean>();

  onConfirm() {
    this.confirmed.emit(true);
    this.isVisible = false;
  }

  onCancel() {
    this.confirmed.emit(false);
    this.isVisible = false;
  }
}
