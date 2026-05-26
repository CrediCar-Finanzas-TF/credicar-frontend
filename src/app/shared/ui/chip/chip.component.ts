import { Component, input } from '@angular/core';

@Component({
  selector: 'app-chip',
  standalone: true,
  template: `
    <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-text-primary shrink-0 select-none">
      {{ initials() }}
    </div>
  `
})
export class ChipComponent {
  initials = input<string>('');
}
