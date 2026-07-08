import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <div class="flex items-center justify-between mt-4 pt-5 border-t border-border-base/40 w-full">
      <span class="text-xs text-text-muted font-medium">
        Mostrando {{ startIndex() }} a {{ endIndex() }} de {{ totalItems() }} {{ itemName() }}
      </span>

      <div class="flex items-center gap-2">
        <button
          (click)="previous.emit()"
          [disabled]="currentPage() === 1"
          class="w-8 h-8 flex items-center justify-center border border-border-base bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover hover:border-border-strong transition-colors rounded-none focus:outline-none disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <button
          (click)="next.emit()"
          [disabled]="currentPage() === totalPages()"
          class="w-8 h-8 flex items-center justify-center border border-border-base bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover hover:border-border-strong transition-colors rounded-none focus:outline-none disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  `
})
export class PaginationComponent {
  // Entradas dinámicas
  startIndex = input<number>(1);
  endIndex = input<number>(6);
  totalItems = input<number>(0);
  itemName = input<string>('clientes');

  currentPage = input<number>(1);
  totalPages = input<number>(1);

  // Eventos que la tabla escuchará
  previous = output<void>();
  next = output<void>();
}
