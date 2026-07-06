import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwitchComponent } from '../../../../shared/ui/switch/switch.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-insurance-coverage-card',
  standalone: true,
  imports: [CommonModule, FormsModule, SwitchComponent, BadgeComponent],
  template: `
    <div class="bg-surface border border-border-base rounded-none p-6 flex flex-col gap-4 transition-colors duration-300">
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-md bg-surface-hover border border-border-base flex items-center justify-center text-text-secondary shrink-0">
            <ng-content select="[icon]"></ng-content>
          </div>
          <h3 class="text-base font-semibold text-text-primary">{{ title() }}</h3>
        </div>

        <div class="text-right shrink-0">
          <p class="text-[10px] text-text-muted uppercase tracking-wide">Costo mensual</p>
          <p class="text-xl font-bold text-text-primary">{{ monthlyCostLabel() }}</p>
        </div>
      </div>

      <p class="text-sm text-text-secondary">{{ description() }}</p>

      <div class="flex items-center gap-3">
        @if (mandatory()) {
          <app-switch [ngModel]="true" [disabled]="true" [ngModelOptions]="{standalone: true}"></app-switch>
          <app-badge>Obligatorio</app-badge>
        } @else {
          <app-switch
            [ngModel]="active()"
            (ngModelChange)="activeChange.emit($event)"
            [ngModelOptions]="{standalone: true}"
            [label]="active() ? 'Cobertura activa' : 'Agregar cobertura'"
          ></app-switch>
        }
      </div>
    </div>
  `
})
export class InsuranceCoverageCardComponent {
  title = input.required<string>();
  description = input.required<string>();
  monthlyCostLabel = input.required<string>();
  mandatory = input<boolean>(false);
  active = input<boolean>(false);

  activeChange = output<boolean>();
}
