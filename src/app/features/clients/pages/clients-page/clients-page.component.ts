import { Component, DestroyRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, skip, switchMap } from 'rxjs';
import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { ChipComponent } from '../../../../shared/ui/chip/chip.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { DrawerComponent } from '../../../../shared/components/drawer/drawer.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ClientFormComponent } from '../../components/client-form/client-form.component';
import { ClientService } from '../../services/client.service';
import { QuotationService } from '../../../simulations/services/quotation.service';
import { Client } from '../../../../core/models/client.model';

interface ClientRow {
  client: Client;
  initials: string;
  name: string;
  dni: string;
  phone: string;
  company: string;
}

@Component({
  selector: 'app-clients-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MetricCardComponent,
    InputComponent,
    ChipComponent,
    ButtonComponent,
    DataTableComponent,
    DrawerComponent,
    ConfirmDialogComponent,
    ClientFormComponent
  ],
  templateUrl: './clients-page.component.html'
})
export class ClientsPageComponent {
  @ViewChild(ClientFormComponent) clientFormComponent!: ClientFormComponent;

  private clientService = inject(ClientService);
  private quotationService = inject(QuotationService);
  private destroyRef = inject(DestroyRef);

  cols = [
    { field: 'client', header: 'Cliente' },
    { field: 'dni', header: 'Documento' },
    { field: 'phone', header: 'Teléfono' },
    { field: 'company', header: 'Empresa' },
    { field: 'actions', header: '' }
  ];

  searchQuery = signal('');
  totalClients = signal(0);
  isLoading = signal(false);
  rows = signal<ClientRow[]>([]);

  isDrawerOpen = signal(false);
  drawerMode = signal<'create' | 'edit'>('create');
  editingClient = signal<Client | null>(null);
  isSavingClient = signal(false);
  formErrorMessage = signal('');

  deleteErrorMessage = signal('');
  isCheckingDelete = signal(false);
  isConfirmDeleteOpen = signal(false);
  isDeleting = signal(false);
  private pendingDeleteClient = signal<Client | null>(null);

  constructor() {
    // Carga inicial inmediata: si esto pasara por el pipe de abajo, debounceTime(300)
    // demoraría también la primera carga de la página (no solo las búsquedas del usuario).
    this.load(this.searchQuery());

    toObservable(this.searchQuery)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        skip(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(search => this.load(search));
  }

  private load(search: string) {
    this.isLoading.set(true);

    this.clientService.searchClientsPage(search, 0, 50).pipe(
      switchMap(page => {
        this.totalClients.set(page.totalElements);
        return of(page.content.map(client => this.toRow(client)));
      }),
      catchError(() => of([] as ClientRow[])),
      finalize(() => this.isLoading.set(false))
    ).subscribe(rows => this.rows.set(rows));
  }

  get companiesCount(): number {
    return new Set(
      this.rows()
        .map(row => row.client.company)
        .filter(company => !!company)
    ).size;
  }

  get averageMonthlyIncomeLabel(): string {
    const incomes = this.rows().map(row => row.client.monthlyIncome ?? 0);
    if (incomes.length === 0) return 'S/ 0.00';
    const average = incomes.reduce((sum, value) => sum + value, 0) / incomes.length;
    return `S/ ${average.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  get averageSeniorityLabel(): string {
    const seniorities = this.rows().map(row => row.client.laborSeniority ?? 0);
    if (seniorities.length === 0) return '0 años';
    const average = seniorities.reduce((sum, value) => sum + value, 0) / seniorities.length;
    return `${average.toLocaleString('en-US', { maximumFractionDigits: 1 })} años`;
  }

  openCreateDrawer() {
    this.formErrorMessage.set('');
    this.drawerMode.set('create');
    this.editingClient.set(null);
    this.isDrawerOpen.set(true);
    this.clientFormComponent.resetForm();
  }

  openEditDrawer(client: Client) {
    this.formErrorMessage.set('');
    this.drawerMode.set('edit');
    this.editingClient.set(client);
    this.isDrawerOpen.set(true);
    this.clientFormComponent.patchValues(client);
  }

  closeDrawer() {
    this.isDrawerOpen.set(false);
  }

  onSaveClient() {
    this.clientFormComponent.submitForm();
  }

  onClientFormSubmit(updated: Client) {
    const mode = this.drawerMode();
    const editingId = this.editingClient()?.id;
    if (mode === 'edit' && !editingId) return;

    this.isSavingClient.set(true);
    this.formErrorMessage.set('');

    const request$ = mode === 'create'
      ? this.clientService.createClient(updated)
      : this.clientService.updateClient(editingId!, updated);

    request$.subscribe({
      next: () => {
        this.isSavingClient.set(false);
        this.closeDrawer();
        this.load(this.searchQuery());
      },
      error: () => {
        this.isSavingClient.set(false);
        this.formErrorMessage.set(
          mode === 'create'
            ? 'No se pudo registrar el cliente. Verifica los datos e inténtalo de nuevo.'
            : 'No se pudo guardar los cambios. Verifica los datos e inténtalo de nuevo.'
        );
      }
    });
  }

  // Solo se puede eliminar un cliente si no tiene cotizaciones asociadas: se verifica
  // en el momento (no al cargar la tabla) para no repetir el N+1 que ya sacamos de esta página.
  requestDelete(client: Client) {
    if (!client.id) return;

    this.deleteErrorMessage.set('');
    this.isCheckingDelete.set(true);

    this.quotationService.getQuotationsByClient(Number(client.id)).pipe(
      catchError(() => of([]))
    ).subscribe(quotations => {
      this.isCheckingDelete.set(false);

      if (quotations.length > 0) {
        this.showDeleteError(
          `No se puede eliminar a ${client.firstName} ${client.lastName}: tiene ${quotations.length} cotización(es) asociada(s).`
        );
        return;
      }

      this.pendingDeleteClient.set(client);
      this.isConfirmDeleteOpen.set(true);
    });
  }

  get pendingDeleteClientName(): string {
    const client = this.pendingDeleteClient();
    return client ? `${client.firstName} ${client.lastName}` : '';
  }

  cancelDelete() {
    this.isConfirmDeleteOpen.set(false);
    this.pendingDeleteClient.set(null);
  }

  confirmDelete() {
    if (this.isDeleting()) return;

    const client = this.pendingDeleteClient();
    if (!client?.id) return;

    this.isDeleting.set(true);

    this.clientService.deleteClient(client.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.isConfirmDeleteOpen.set(false);
        this.pendingDeleteClient.set(null);
        this.load(this.searchQuery());
      },
      error: () => {
        this.isDeleting.set(false);
        this.isConfirmDeleteOpen.set(false);
        this.pendingDeleteClient.set(null);
        this.showDeleteError('No se pudo eliminar el cliente. Inténtalo de nuevo.');
      }
    });
  }

  // Toast temporal: no ocupa espacio en el flujo de la página, se autolimpia a los 2s
  // y se desvanece antes de salir del DOM (deleteToastVisible controla el fade-out).
  deleteToastVisible = signal(false);
  private deleteErrorTimeoutId?: ReturnType<typeof setTimeout>;
  private deleteErrorHideTimeoutId?: ReturnType<typeof setTimeout>;

  private showDeleteError(message: string) {
    clearTimeout(this.deleteErrorTimeoutId);
    clearTimeout(this.deleteErrorHideTimeoutId);

    this.deleteErrorMessage.set(message);
    this.deleteToastVisible.set(true);

    this.deleteErrorTimeoutId = setTimeout(() => {
      this.deleteToastVisible.set(false);
      this.deleteErrorHideTimeoutId = setTimeout(() => this.deleteErrorMessage.set(''), 300);
    }, 2000);
  }

  private toRow(client: Client): ClientRow {
    return {
      client,
      initials: this.initialsOf(client),
      name: `${client.firstName} ${client.lastName}`,
      dni: client.documentNumber,
      phone: client.phone,
      company: client.company || '—'
    };
  }

  private initialsOf(client: Client): string {
    return `${client.firstName.charAt(0)}${client.lastName.charAt(0)}`.toUpperCase();
  }
}
