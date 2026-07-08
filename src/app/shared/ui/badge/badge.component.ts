import { Component } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-medium tracking-wide border border-border-base text-text-secondary rounded-full bg-transparent whitespace-nowrap">
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {}
