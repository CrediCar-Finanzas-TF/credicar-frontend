import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { Client } from '../../../../core/models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  template: `
    <div class="bg-surface border border-border-base rounded-lg flex flex-col h-full overflow-hidden transition-colors duration-300">
      <div class="p-5 flex flex-col gap-4 border-b border-border-base">
        <h3 class="text-xs font-semibold text-text-secondary tracking-wider uppercase">Clientes registrados</h3>
        <app-input placeholder="Buscar..." [hasLeftIcon]="true" [(ngModel)]="searchQuery">
          <svg left-icon xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </app-input>
      </div>

      <div class="flex-1 overflow-y-auto max-h-[520px] p-3 flex flex-col gap-2">
        @for (client of filteredClients(); track client.id) {
          <button
            type="button"
            (click)="select.emit(client)"
            class="w-full text-left px-4 py-3 rounded-md border transition-colors duration-200 hover:bg-surface-hover hover:border-border-strong"
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
      </div>
    </div>
  `
})
export class ClientListComponent {
  clients = input.required<Client[]>();
  selectedId = input<string | null>(null);
  select = output<Client>();

  searchQuery = signal('');

  filteredClients = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return this.clients();

    return this.clients().filter(client =>
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(query) ||
      client.documentNumber.toLowerCase().includes(query)
    );
  });
}