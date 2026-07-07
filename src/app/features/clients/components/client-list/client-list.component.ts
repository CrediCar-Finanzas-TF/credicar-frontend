import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, switchMap } from 'rxjs';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { Client } from '../../../../core/models/client.model';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  template: `
    <div class="bg-surface border border-border-base rounded-none flex flex-col h-full overflow-hidden transition-colors duration-300">

      <!-- 1. Cambiamos p-3 por pl-3 py-3 pr-[22px] para compensar los 10px del scrollbar -->
      <div class="pl-3 py-3 pr-[22px] flex flex-col gap-4 border-b border-border-base">
        <h3 class="text-xs font-semibold text-text-secondary tracking-wider uppercase">Clientes registrados</h3>

        <div class="w-full">
          <app-input placeholder="Buscar..." [hasLeftIcon]="true" [(ngModel)]="searchQuery">
            <svg left-icon xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </app-input>
        </div>
      </div>

      <!-- 2. Cambiamos overflow-y-auto por overflow-y-scroll para mantener la alineación siempre -->
      <div class="flex-1 overflow-y-scroll max-h-[520px] p-3 flex flex-col gap-2">
        @if (isLoading()) {
          <div class="p-6 text-center text-sm text-text-muted">Buscando...</div>
        } @else {
          @for (client of clients(); track client.id) {
            <button
              type="button"
              (click)="select.emit(client)"
              class="w-full text-left px-4 py-3 rounded-none border transition-colors duration-200 hover:bg-surface-hover hover:border-border-strong"
              [ngClass]="selectedId() === client.id
                ? 'bg-surface-hover border-border-strong'
                : 'bg-surface-elevated/60 border-border-base'"
            >
              <p class="text-sm font-medium text-text-primary truncate">{{ client.firstName }} {{ client.lastName }}</p>
              <p class="text-xs text-text-muted">{{ client.documentType }}: {{ client.documentNumber }}</p>
            </button>
          } @empty {
            <div class="p-6 text-center text-sm text-text-muted">Sin resultados.</div>
          }
        }
      </div>
    </div>
  `
})
export class ClientListComponent {
  selectedId = input<string | null>(null);
  select = output<Client>();

  searchQuery = signal('');
  isLoading = signal(false);

  private clientService = inject(ClientService);

  private results$ = toObservable(this.searchQuery).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(query => {
      this.isLoading.set(true);
      return this.clientService.searchClients(query).pipe(
        catchError(() => of([] as Client[])),
        finalize(() => this.isLoading.set(false))
      );
    })
  );

  clients = toSignal(this.results$, { initialValue: [] as Client[] });
}
