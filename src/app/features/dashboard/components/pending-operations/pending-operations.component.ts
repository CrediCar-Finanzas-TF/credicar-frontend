import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pending-operations',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block h-full' },
  template: `
    <div class="bg-surface border border-border-base p-6 shadow-glow relative overflow-hidden transition-colors duration-300 h-full flex flex-col">

      <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

      <div class="flex items-center gap-2 mb-6 text-text-muted">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
        <span class="text-[10px] font-bold uppercase tracking-widest">Pendientes de atención</span>
      </div>

      <div class="flex-1 flex flex-col justify-center">
        <h3 class="text-2xl font-bold text-text-primary mb-1">{{ currentItem().client }}</h3>
        <p class="text-sm text-text-secondary mb-4">{{ currentItem().vehicle }}</p>

        <div class="flex items-center gap-2 mb-6">
          <span class="w-2 h-2 rounded-full bg-warning"></span>
          <span class="text-xs text-text-muted">Estado: {{ currentItem().status }}</span>
        </div>

        <div class="flex flex-col gap-2 border-t border-border-base/40 pt-4 mb-6">
          <div class="flex justify-between items-center">
            <span class="text-xs text-text-muted">Monto a financiar</span>
            <span class="text-sm font-bold text-text-primary">{{ currentItem().amount }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-text-muted">Plazo</span>
            <span class="text-sm font-bold text-text-primary">{{ currentItem().term }}</span>
          </div>
        </div>

        <button class="w-full border border-border-strong bg-transparent hover:bg-surface-hover text-text-primary py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none">
          Continuar
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </div>

      <div class="flex justify-center gap-1.5 mt-6">
        @for (item of pendingList; track $index) {
          <button
            (click)="setIndex($index)"
            class="w-1.5 h-1.5 rounded-full transition-all duration-300 focus:outline-none"
            [ngClass]="currentIndex() === $index ? 'bg-text-primary scale-125' : 'bg-border-strong hover:bg-text-muted'"
          ></button>
        }
      </div>

    </div>
  `
})
export class PendingOperationsComponent implements OnInit, OnDestroy {
  currentIndex = signal(0);
  private intervalId: any;

  pendingList = [
    { client: 'Andrés Levano', vehicle: 'Toyota Corolla 2026', status: 'Pendiente de firma', amount: 'S/ 85,000', term: '48 meses' },
    { client: 'María Torres', vehicle: 'Kia Sportage 2025', status: 'Falta DNI cónyuge', amount: 'S/ 112,000', term: '60 meses' },
    { client: 'Carlos Mendoza', vehicle: 'Mazda CX-5 2025', status: 'Aprobación final', amount: 'S/ 120,500', term: '36 meses' }
  ];

  currentItem = computed(() => this.pendingList[this.currentIndex()]);

  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.currentIndex.update(index => (index + 1) % this.pendingList.length);
    }, 4000);
  }

  stopCarousel() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  setIndex(index: number) {
    this.currentIndex.set(index);
    this.stopCarousel();
    this.startCarousel();
  }
}
