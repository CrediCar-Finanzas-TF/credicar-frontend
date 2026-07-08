import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
        (click)="close.emit()"
      ></div>
    }

    <div
      class="fixed top-0 right-0 h-full w-full max-w-[400px] bg-surface border-l border-border-base shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col"
      [class.translate-x-full]="!isOpen()"
      [class.translate-x-0]="isOpen()"
    >
      <button
        (click)="close.emit()"
        class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors z-50 border border-white/10 backdrop-blur-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <div class="flex-1 overflow-y-auto">
        <ng-content></ng-content>
      </div>

    </div>
  `
})
export class DrawerComponent {
  isOpen = input<boolean>(false);
  close = output<void>();
}
