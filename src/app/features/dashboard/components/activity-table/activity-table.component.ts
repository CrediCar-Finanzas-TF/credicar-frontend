import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { ClientService } from '../../../clients/services/client.service';
import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { QuotationService } from '../../../simulations/services/quotation.service';
import { Client } from '../../../../core/models/client.model';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { CURRENCY_SYMBOL, Quotation } from '../../../../core/models/quotation.model';

interface ActivityRow {
  id: number;
  client: string;
  vehicle: string;
  amountLabel: string;
  termLabel: string;
}

@Component({
  selector: 'app-activity-table',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  host: { class: 'flex flex-col flex-1 w-full h-full' },
  template: `
    <div class="flex flex-col flex-1 transition-colors duration-300">

      <div class="flex items-center justify-between p-6 bg-surface border-t border-l border-r border-border-base shadow-sm shrink-0">
        <h2 class="text-lg font-bold text-text-primary">Actividad Reciente</h2>
        <a routerLink="/quotations" class="text-xs font-medium text-text-secondary border border-border-base px-3 py-1.5 hover:text-text-primary hover:bg-surface-hover transition-colors">
          Ver todo
        </a>
      </div>

      <app-data-table
        [columns]="cols"
        [data]="rows()"
        [isLoading]="isLoading()"
        [showPagination]="false"
        minWidth="min-w-[500px]"
        class="flex-1 flex flex-col [&>div]:border-t-0 [&>div]:flex-1 [&>div]:h-full"
      >
        <ng-template #bodyTpl let-row let-col="col">

          @if (col.field === 'client') {
            <span class="text-sm font-medium text-text-primary">{{ row.client }}</span>
          }

          @else if (col.field === 'action') {
            <div class="text-center w-full">
              <button (click)="viewSchedule(row)" class="text-text-muted hover:text-text-primary transition-colors focus:outline-none cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          }

          @else {
            <span class="text-sm text-text-secondary">{{ row[col.field] }}</span>
          }

        </ng-template>
      </app-data-table>

    </div>
  `
})
export class ActivityTableComponent implements OnInit {
  private clientService = inject(ClientService);
  private vehicleService = inject(VehicleService);
  private quotationService = inject(QuotationService);
  private router = inject(Router);

  cols = [
    { field: 'client', header: 'Cliente' },
    { field: 'vehicle', header: 'Vehículo' },
    { field: 'amountLabel', header: 'Monto Financiado' },
    { field: 'termLabel', header: 'Plazo' },
    { field: 'action', header: '' }
  ];

  isLoading = signal(false);
  rows = signal<ActivityRow[]>([]);

  ngOnInit() {
    this.load();
  }

  viewSchedule(row: ActivityRow) {
    this.router.navigate(['/quotations', row.id]);
  }

  // Sin "Estado" (no existe ciclo de aprobación en el backend) ni "Fecha" (Quotation no
  // tiene timestamp): se ordena por id descendente como proxy honesto de "más reciente".
  private load() {
    this.isLoading.set(true);

    forkJoin({
      clients: this.clientService.searchClientsPage('', 0, 1000).pipe(catchError(() => of({ content: [] as Client[] }))),
      vehicles: this.vehicleService.getVehicles().pipe(catchError(() => of([] as Vehicle[])))
    }).subscribe(({ clients, vehicles }) => {
      const clientMap = new Map(clients.content.map(client => [Number(client.id), client]));
      const vehicleMap = new Map(
        vehicles.filter((vehicle): vehicle is Vehicle & { id: number } => vehicle.id !== undefined)
          .map(vehicle => [vehicle.id, vehicle])
      );

      if (clients.content.length === 0) {
        this.isLoading.set(false);
        this.rows.set([]);
        return;
      }

      const quotationRequests = clients.content.map(client =>
        this.quotationService.getQuotationsByClient(Number(client.id)).pipe(catchError(() => of([] as Quotation[])))
      );

      forkJoin(quotationRequests).subscribe(quotationsPerClient => {
        this.isLoading.set(false);

        const recent = quotationsPerClient.flat()
          .sort((a, b) => b.id - a.id)
          .slice(0, 5);

        this.rows.set(recent.map(quotation => this.toRow(quotation, clientMap, vehicleMap)));
      });
    });
  }

  private toRow(quotation: Quotation, clientMap: Map<number, Client>, vehicleMap: Map<number, Vehicle>): ActivityRow {
    const client = clientMap.get(quotation.clientId);
    const vehicle = vehicleMap.get(quotation.vehicleId);
    const symbol = CURRENCY_SYMBOL[quotation.currency] ?? quotation.currency;

    return {
      id: quotation.id,
      client: client ? `${client.firstName} ${client.lastName}` : `Cliente #${quotation.clientId}`,
      vehicle: vehicle ? `${vehicle.brand} ${vehicle.model}` : `Vehículo #${quotation.vehicleId}`,
      amountLabel: `${symbol} ${quotation.financingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      termLabel: `${quotation.totalQuotas} meses`
    };
  }
}
