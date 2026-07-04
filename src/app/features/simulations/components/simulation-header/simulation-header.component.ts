import { Component, input } from '@angular/core';

@Component({
  selector: 'app-simulation-header',
  standalone: true,
  template: `
    <div class="bg-surface border border-border-base rounded-lg p-8 transition-colors duration-300">
      <h2 class="text-4xl font-bold text-text-primary">{{ title() }}</h2>
      <p class="text-base text-text-secondary mt-2">{{ subtitle() }}</p>
    </div>
  `
})
export class SimulationHeaderComponent {
  title = input.required<string>();
  subtitle = input<string>('');
}