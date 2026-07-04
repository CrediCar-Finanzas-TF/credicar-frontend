import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex gap-2 w-full">
      @for (step of steps(); track $index) {
        <div
          class="h-1.5 flex-1 rounded-full transition-colors duration-300"
          [ngClass]="$index <= currentStep() ? 'bg-accent' : 'bg-surface-elevated border border-border-base'"
        ></div>
      }
    </div>
  `
})
export class ProgressStepperComponent {
  steps = input<string[]>(['Cliente', 'Vehículo', 'Financiamiento', 'Seguro', 'Resultado']);
  currentStep = input<number>(0);
}