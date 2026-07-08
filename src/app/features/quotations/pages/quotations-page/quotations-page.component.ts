import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { ChipComponent } from '../../../../shared/ui/chip/chip.component';
import { DataTableComponent, TableColumn } from '../../../../shared/components/data-table/data-table.component';
import { QuotationService } from '../../../simulations/services/quotation.service';
import { ClientService } from '../../../clients/services/client.service';
import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { Client } from '../../../../core/models/client.model';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { CURRENCY_SYMBOL, Quotation } from '../../../../core/models/quotation.model';

interface QuotationRow {
  id: number;
  initials: string;
  clientName: string;
  vehicleLabel: string;
  financedAmount: number;
  financedAmountLabel: string;
  currency: string;
  termLabel: string;
}

@Component({
  selector: 'app-quotations-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MetricCardComponent, InputComponent, ChipComponent, DataTableComponent],
  templateUrl: './quotations-page.component.html'
})
export class QuotationsPageComponent implements OnInit {
  private quotationService = inject(QuotationService);
  private clientService = inject(ClientService);
  private vehicleService = inject(VehicleService);
  private router = inject(Router);

  cols: TableColumn[] = [
    { field: 'client', header: 'Cliente' },
    { field: 'vehicleLabel', header: 'Vehículo' },
    { field: 'financedAmountLabel', header: 'Monto Financiado' },
    { field: 'termLabel', header: 'Plazo' },
    { field: 'currency', header: 'Moneda' },
    { field: 'actions', header: '' }
  ];

  searchQuery = '';
  isLoading = signal(false);
  errorMessage = signal('');
  rows = signal<QuotationRow[]>([]);

  ngOnInit() {
    this.load();
  }

  get filteredRows(): QuotationRow[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return this.rows();
    return this.rows().filter(row =>
      `${row.clientName} ${row.vehicleLabel}`.toLowerCase().includes(query)
    );
  }

  get quotationsTotalCount(): number {
    return this.rows().length;
  }

  get clientsQuotedCount(): number {
    return new Set(this.rows().map(row => row.clientName)).size;
  }

  get totalFinancedLabel(): string {
    const total = this.rows().reduce((sum, row) => sum + row.financedAmount, 0);
    return `S/ ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  get averageFinancedLabel(): string {
    const rows = this.rows();
    if (rows.length === 0) return 'S/ 0.00';
    const average = rows.reduce((sum, row) => sum + row.financedAmount, 0) / rows.length;
    return `S/ ${average.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  viewSchedule(row: QuotationRow) {
    this.router.navigate(['/quotations', row.id]);
  }

  private load() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    forkJoin({
      quotations: this.quotationService.getAllQuotations(0, 200).pipe(catchError(() => of(null))),
      clients: this.clientService.searchClientsPage('', 0, 1000).pipe(catchError(() => of({ content: [] as Client[] }))),
      vehicles: this.vehicleService.getVehicles().pipe(catchError(() => of([] as Vehicle[])))
    }).subscribe(({ quotations, clients, vehicles }) => {
      this.isLoading.set(false);

      if (!quotations) {
        // Pendiente en backend: aún no existe GET /quotations paginado (solo por cliente o por id).
        this.errorMessage.set('No se pudo cargar el listado de cotizaciones. El backend todavía no expone un endpoint para listarlas todas.');
        this.rows.set([]);
        return;
      }

      const clientMap = new Map(clients.content.map(client => [Number(client.id), client]));
      const vehicleMap = new Map(
        vehicles.filter((vehicle): vehicle is Vehicle & { id: number } => vehicle.id !== undefined)
          .map(vehicle => [vehicle.id, vehicle])
      );

      this.rows.set(quotations.content.map(quotation => this.toRow(quotation, clientMap, vehicleMap)));
    });
  }

  private toRow(quotation: Quotation, clientMap: Map<number, Client>, vehicleMap: Map<number, Vehicle>): QuotationRow {
    const client = clientMap.get(quotation.clientId);
    const vehicle = vehicleMap.get(quotation.vehicleId);
    const symbol = CURRENCY_SYMBOL[quotation.currency] ?? quotation.currency;

    return {
      id: quotation.id,
      initials: client ? `${client.firstName.charAt(0)}${client.lastName.charAt(0)}`.toUpperCase() : '?',
      clientName: client ? `${client.firstName} ${client.lastName}` : `Cliente #${quotation.clientId}`,
      vehicleLabel: vehicle ? `${vehicle.brand} ${vehicle.model}` : `Vehículo #${quotation.vehicleId}`,
      financedAmount: quotation.financingAmount,
      financedAmountLabel: `${symbol} ${quotation.financingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      currency: quotation.currency,
      termLabel: `${quotation.totalQuotas} meses`
    };
  }
}
