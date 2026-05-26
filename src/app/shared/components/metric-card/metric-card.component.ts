import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-surface border border-border-base p-6 flex flex-col gap-4 rounded-none shadow-sm transition-colors hover:bg-surface-hover">

      <div class="flex justify-between items-start">
        <h3 class="text-xs font-semibold text-text-secondary uppercase tracking-widest">{{ title() }}</h3>
        <div class="text-text-muted">
          <ng-content select="[icon]"></ng-content>
        </div>
      </div>

      <div class="flex flex-col gap-3 mt-2">
        <span class="text-4xl font-bold text-text-primary tracking-tight">{{ value() }}</span>
        <div class="w-12 h-[2px] bg-border-strong"></div>
      </div>

    </div>
  `
})
export class MetricCardComponent {
  title = input<string>('');
  value = input<string | number>('');
}
