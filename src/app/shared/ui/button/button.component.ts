import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [ngClass]="computedClasses()"
      class="flex items-center justify-center gap-2 rounded-none font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  variant = input<'primary' | 'outline' | 'ghost'>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  fullWidth = input<boolean>(false);
  disabled = input<boolean>(false);

  computedClasses = computed(() => {
    const base = {
      'w-full': this.fullWidth(),
      'px-4 py-2.5': true,
    };

    const variants = {
      'bg-accent text-background hover:bg-accent-hover': this.variant() === 'primary',
      'bg-transparent border border-border-base text-text-primary hover:bg-glass-hover': this.variant() === 'outline',
      'bg-transparent text-text-primary hover:bg-glass-hover': this.variant() === 'ghost',
    };

    return { ...base, ...variants };
  });
}
