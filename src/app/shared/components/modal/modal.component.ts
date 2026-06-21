import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() saving = false;
  @Input() saveLabel = 'Guardar';

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  onBackdropClick(): void {
    this.closed.emit();
  }
}
