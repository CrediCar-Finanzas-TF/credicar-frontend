import { Component, DestroyRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, finalize, forkJoin, of, switchMap } from 'rxjs';
import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { ChipComponent } from '../../../../shared/ui/chip/chip.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { DrawerComponent } from '../../../../shared/components/drawer/drawer.component';
import { ClientFormComponent } from '../../components/client-form/client-form.component';
import { ClientService } from '../../services/client.service';
import { QuotationService } from '../../../simulations/services/quotation.service';
import { SimulationStore } from '../../../simulations/store/simulation.store';
import { Client } from '../../../../core/models/client.model';
import { CURRENCY_SYMBOL, Quotation } from '../../../../core/models/quotation.model';

interface QuotedClientRow {
  client: Client;
  initials: string;
  name: string;
  dni: string;
  phone: string;
  status: string;
  quotationsCount: number;
  financedAmount: number;
  financedAmountLabel: string;
  latestQuotationId: number;
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
    ButtonComponent,
    DataTableComponent,
    DrawerComponent,
    ClientFormComponent
  ],
  templateUrl: './clients-page.component.html'
})
export class ClientsPageComponent {
  @ViewChild(ClientFormComponent) clientFormComponent!: ClientFormComponent;

  private clientService = inject(ClientService);
  private quotationService = inject(QuotationService);
  private simulationStore = inject(SimulationStore);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  cols = [
    { field: 'client', header: 'Cliente' },
    { field: 'dni', header: 'DNI' },
    { field: 'phone', header: 'Teléfono' },
    { field: 'status', header: 'Estado' },
    { field: 'financedAmountLabel', header: 'Monto Financiado' },
    { field: 'actions', header: '' }
  ];

  searchQuery = signal('');
  totalClients = signal(0);
  isLoading = signal(false);
  rows = signal<QuotedClientRow[]>([]);

  isEditDrawerOpen = signal(false);
  editingClient = signal<Client | null>(null);
  isSavingEdit = signal(false);
  editErrorMessage = signal('');

  constructor() {
    toObservable(this.searchQuery)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(search => this.load(search));
  }

  private load(search: string) {
    this.isLoading.set(true);

    this.clientService.searchClientsPage(search, 0, 50).pipe(
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
    ).subscribe(rows => this.rows.set(rows));
  }

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

  viewSchedule(row: QuotedClientRow) {
    this.simulationStore.setClient(row.client);
    this.router.navigate(['/simulations/result', row.latestQuotationId]);
  }

  openEditDrawer(client: Client) {
    this.editErrorMessage.set('');
    this.editingClient.set(client);
    this.isEditDrawerOpen.set(true);
    this.clientFormComponent.patchValues(client);
  }

  closeEditDrawer() {
    this.isEditDrawerOpen.set(false);
  }

  onSaveEdit() {
    this.clientFormComponent.submitForm();
  }

  onClientFormSubmit(updated: Client) {
    const client = this.editingClient();
    if (!client?.id) return;

    this.isSavingEdit.set(true);
    this.editErrorMessage.set('');

    this.clientService.updateClient(client.id, updated).subscribe({
      next: () => {
        this.isSavingEdit.set(false);
        this.isEditDrawerOpen.set(false);
        this.load(this.searchQuery());
      },
      error: () => {
        this.isSavingEdit.set(false);
        this.editErrorMessage.set('No se pudo guardar los cambios. Verifica los datos e inténtalo de nuevo.');
      }
    });
  }

  private toRow(client: Client, quotations: Quotation[]): QuotedClientRow {
    const latest = quotations.reduce((a, b) => (b.id > a.id ? b : a));
    const symbol = CURRENCY_SYMBOL[latest.currency] ?? latest.currency;

    return {
      client,
      initials: this.initialsOf(client),
      name: `${client.firstName} ${client.lastName}`,
      dni: client.documentNumber,
      phone: client.phone,
      status: 'Cotizado',
      quotationsCount: quotations.length,
      financedAmount: latest.financingAmount,
      financedAmountLabel: `${symbol} ${latest.financingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      latestQuotationId: latest.id
    };
  }

  private initialsOf(client: Client): string {
    return `${client.firstName.charAt(0)}${client.lastName.charAt(0)}`.toUpperCase();
  }
}
