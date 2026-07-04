import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-simulation-footer',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div
      style="view-transition-name: simulation-footer"
      class="fixed bottom-0 left-[280px] right-0 z-30 bg-surface-elevated/95 backdrop-blur-md border-t border-border-base grid grid-cols-[1fr_auto_1fr] items-center gap-10 px-10 py-5 transition-colors duration-300"
    >

      <app-button
        variant="outline"
        [rounded]="true"
        [disabled]="!showBackButton()"
        class="justify-self-start"
        (click)="back.emit()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        <span>Volver</span>
      </app-button>

      <div class="hidden md:flex items-center gap-10">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-md bg-surface-hover border border-border-base flex items-center justify-center shrink-0 text-text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          </div>

          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-text-muted">Cliente seleccionado</span>
            <span class="text-sm font-semibold text-text-primary">{{ clientName() || 'Ninguno' }}</span>
          </div>
        </div>

        <div class="w-px h-8 bg-border-base"></div>

        <div class="flex flex-col gap-0.5">
          <span class="text-xs text-text-muted">Vehículo seleccionado</span>
          <span class="text-sm font-semibold text-text-primary flex items-center gap-1.5">
            {{ vehicleName() || 'Ninguno' }}
            @if (!vehicleName()) {
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            }
          </span>
        </div>

        @if (showBasePrice()) {
          <div class="w-px h-8 bg-border-base"></div>

          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-text-muted">Precio base</span>
            <span class="text-sm font-semibold text-text-primary">{{ basePrice() || 'S/ 0' }}</span>
          </div>
        }
      </div>

      <div class="flex items-center gap-3 justify-self-end">
        @if (showSecondaryButton()) {
          <app-button variant="outline" [rounded]="true" (click)="secondary.emit()">
            <span>{{ secondaryLabel() }}</span>
          </app-button>
        }

        <app-button [rounded]="true" [disabled]="continueDisabled()" (click)="continue.emit()">
          <span>{{ continueLabel() }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </app-button>
      </div>

    </div>
  `
})
export class SimulationFooterComponent {
  clientName = input<string | null>(null);
  vehicleName = input<string | null>(null);
  basePrice = input<string | null>(null);
  showBasePrice = input<boolean>(true);

  showBackButton = input<boolean>(true);
  continueLabel = input<string>('Continuar');
  continueDisabled = input<boolean>(false);

  showSecondaryButton = input<boolean>(false);
  secondaryLabel = input<string>('');

  back = output<void>();
  continue = output<void>();
  secondary = output<void>();
}