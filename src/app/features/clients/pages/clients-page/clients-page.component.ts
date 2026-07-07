import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, finalize, forkJoin, of, switchMap } from 'rxjs';
import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { ChipComponent } from '../../../../shared/ui/chip/chip.component';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { ClientService } from '../../services/client.service';
import { QuotationService } from '../../../simulations/services/quotation.service';
import { Client } from '../../../../core/models/client.model';
import { CURRENCY_SYMBOL, Quotation } from '../../../../core/models/quotation.model';

interface QuotedClientRow {
  initials: string;
  name: string;
  dni: string;
  phone: string;
  status: string;
  quotationsCount: number;
  financedAmount: number;
  financedAmountLabel: string;
}

@Component({
  selector: 'app-clients-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MetricCardComponent,
    InputComponent,
    BadgeComponent,
    ChipComponent,
    DataTableComponent
  ],
  templateUrl: './clients-page.component.html'
})
export class ClientsPageComponent {
  private clientService = inject(ClientService);
  private quotationService = inject(QuotationService);

  cols = [
    { field: 'client', header: 'Cliente' },
    { field: 'dni', header: 'DNI' },
    { field: 'phone', header: 'Teléfono' },
    { field: 'status', header: 'Estado' },
    { field: 'financedAmountLabel', header: 'Monto Financiado' }
  ];

  searchQuery = signal('');
  totalClients = signal(0);
  isLoading = signal(false);

  private rows$ = toObservable(this.searchQuery).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(search => {
      this.isLoading.set(true);
      return this.clientService.searchClientsPage(search, 0, 50).pipe(
        switchMap(page => {
          this.totalClients.set(page.totalElements);
          const clients = page.content;

          if (clients.length === 0) return of([] as QuotedClientRow[]);

          const quotationRequests = clients.map(client =>
            this.quotationService.getQuotationsByClient(Number(client.id)).pipe(
              catchError(() => of([] as Quotation[]))
            )
          );

          return forkJoin(quotationRequests).pipe(
            switchMap(quotationsPerClient => {
              const rows = clients
                .map((client, index) => ({ client, quotations: quotationsPerClient[index] }))
                .filter(entry => entry.quotations.length > 0)
                .map(entry => this.toRow(entry.client, entry.quotations));
              return of(rows);
            })
          );
        }),
        catchError(() => of([] as QuotedClientRow[])),
        finalize(() => this.isLoading.set(false))
      );
    })
  );

  rows = toSignal(this.rows$, { initialValue: [] as QuotedClientRow[] });

  get quotedClientsCount(): number {
    return this.rows().length;
  }

  get activeSimulationsCount(): number {
    return this.rows().reduce((sum, row) => sum + row.quotationsCount, 0);
  }

  get totalFinancedAmount(): string {
    const total = this.rows().reduce((sum, row) => sum + row.financedAmount, 0);
    return `S/ ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  private toRow(client: Client, quotations: Quotation[]): QuotedClientRow {
    const latest = quotations.reduce((a, b) => (b.id > a.id ? b : a));
    const symbol = CURRENCY_SYMBOL[latest.currency] ?? latest.currency;

    return {
      initials: this.initialsOf(client),
      name: `${client.firstName} ${client.lastName}`,
      dni: client.documentNumber,
      phone: client.phone,
      status: 'Cotizado',
      quotationsCount: quotations.length,
      financedAmount: latest.financingAmount,
      financedAmountLabel: `${symbol} ${latest.financingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    };
  }

  private initialsOf(client: Client): string {
    return `${client.firstName.charAt(0)}${client.lastName.charAt(0)}`.toUpperCase();
  }
}
