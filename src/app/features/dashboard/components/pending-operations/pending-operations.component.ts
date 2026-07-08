import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClientService } from '../../../clients/services/client.service';
import { QuotationService } from '../../../simulations/services/quotation.service';
import { Client } from '../../../../core/models/client.model';

interface LeadClient {
  id: string;
  name: string;
  company: string;
  phone: string;
}

@Component({
  selector: 'app-pending-operations',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block h-full' },
  template: `
    <div class="bg-surface border border-border-base p-6 shadow-glow relative overflow-hidden transition-colors duration-300 h-full flex flex-col">

      <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

      <div class="flex items-center gap-2 mb-6 text-text-muted">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
        <span class="text-[10px] font-bold uppercase tracking-widest">Clientes por Cotizar</span>
      </div>

      <div class="flex-1 flex flex-col justify-center">
        @if (isLoading()) {
          <p class="text-sm text-text-muted">Cargando...</p>
        } @else if (leads().length === 0) {
          <h3 class="text-xl font-bold text-text-primary mb-1">¡Todo al día!</h3>
          <p class="text-sm text-text-secondary">Todos tus clientes ya tienen al menos una cotización.</p>
        } @else {
          <h3 class="text-2xl font-bold text-text-primary mb-1">{{ currentItem()!.name }}</h3>
          <p class="text-sm text-text-secondary mb-4">{{ currentItem()!.company || 'Sin empresa registrada' }}</p>

          <div class="flex items-center gap-2 mb-6">
            <span class="w-2 h-2 rounded-full bg-warning"></span>
            <span class="text-xs text-text-muted">Aún no tiene ninguna cotización</span>
          </div>

          <div class="flex flex-col gap-2 border-t border-border-base/40 pt-4 mb-6">
            <div class="flex justify-between items-center">
              <span class="text-xs text-text-muted">Teléfono</span>
              <span class="text-sm font-bold text-text-primary">{{ currentItem()!.phone }}</span>
            </div>
          </div>

          <button
            (click)="startQuotation()"
            class="w-full border border-border-strong bg-transparent hover:bg-surface-hover text-text-primary py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none"
          >
            Cotizar ahora
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        }
      </div>

      @if (leads().length > 1) {
        <div class="flex justify-center gap-1.5 mt-6">
          @for (item of leads(); track item.id; let i = $index) {
            <button
              (click)="setIndex(i)"
              class="w-1.5 h-1.5 rounded-full transition-all duration-300 focus:outline-none"
              [ngClass]="currentIndex() === i ? 'bg-text-primary scale-125' : 'bg-border-strong hover:bg-text-muted'"
            ></button>
          }
        </div>
      }

    </div>
  `
})
export class PendingOperationsComponent implements OnInit, OnDestroy {
  private clientService = inject(ClientService);
  private quotationService = inject(QuotationService);
  private router = inject(Router);

  isLoading = signal(false);
  leads = signal<LeadClient[]>([]);
  currentIndex = signal(0);
  private intervalId: any;

  currentItem = computed(() => this.leads()[this.currentIndex()] ?? null);

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  // "Pendientes de atención" no tiene ningún dato real detrás en el backend (no hay
  // trámites, firmas ni documentos): se reemplaza por algo derivable de verdad —
  // clientes registrados que todavía no tienen ninguna cotización.
  private load() {
    this.isLoading.set(true);

    this.clientService.searchClientsPage('', 0, 1000).pipe(
      catchError(() => of({ content: [] as Client[] }))
    ).subscribe(page => {
      if (page.content.length === 0) {
        this.isLoading.set(false);
        this.leads.set([]);
        return;
      }

      const requests = page.content.map(client =>
        this.quotationService.getQuotationsByClient(Number(client.id)).pipe(catchError(() => of([])))
      );

      forkJoin(requests).subscribe(quotationsPerClient => {
        this.isLoading.set(false);

        const withoutQuotation = page.content
          .filter((_, index) => quotationsPerClient[index].length === 0)
          .map(client => ({
            id: client.id!,
            name: `${client.firstName} ${client.lastName}`,
            company: client.company,
            phone: client.phone
          }));

        this.leads.set(withoutQuotation);
        if (withoutQuotation.length > 0) this.startCarousel();
      });
    });
  }

  startQuotation() {
    this.router.navigate(['/simulations/client']);
  }

  startCarousel() {
    this.stopCarousel();
    this.intervalId = setInterval(() => {
      this.currentIndex.update(index => (index + 1) % this.leads().length);
    }, 4000);
  }

  stopCarousel() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  setIndex(index: number) {
    this.currentIndex.set(index);
    this.startCarousel();
  }
}
