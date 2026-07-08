import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 bg-black/60 z-40 transition-opacity animate-fade-in" (click)="cancel.emit()"></div>

      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div class="bg-surface border border-border-base shadow-2xl rounded-none p-6 flex flex-col gap-5 w-full max-w-sm pointer-events-auto transition-colors duration-300">
          <div class="flex flex-col gap-1.5">
            <h3 class="text-lg font-semibold text-text-primary">{{ title() }}</h3>
            <p class="text-sm text-text-secondary">{{ message() }}</p>
          </div>

          <div class="flex items-center justify-end gap-3">
            <app-button variant="outline" [disabled]="confirmDisabled()" (click)="cancel.emit()">{{ cancelLabel() }}</app-button>
            <button
              type="button"
              [disabled]="confirmDisabled()"
              (click)="confirm.emit()"
              class="px-4 py-2.5 text-sm font-medium bg-danger text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmDialogComponent {
  isOpen = input<boolean>(false);
  title = input<string>('¿Estás seguro?');
  message = input<string>('Esta acción no se puede deshacer.');
  confirmLabel = input<string>('Eliminar');
  cancelLabel = input<string>('Cancelar');
  confirmDisabled = input<boolean>(false);

  confirm = output<void>();
  cancel = output<void>();
}
