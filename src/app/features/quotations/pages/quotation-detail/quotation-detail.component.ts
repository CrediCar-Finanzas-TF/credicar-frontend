import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { DataTableComponent, TableColumn } from '../../../../shared/components/data-table/data-table.component';
import { FinancialSummaryComponent } from '../../../simulations/components/financial-summary/financial-summary.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { QuotationService } from '../../../simulations/services/quotation.service';
import { ClientService } from '../../../clients/services/client.service';
import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { Client } from '../../../../core/models/client.model';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { Quotation } from '../../../../core/models/quotation.model';
import {
  buildFinancingSummary,
  formatGraceType,
  formatMoney,
  formatPercent,
  getFinalBalloonLabel,
  getRegularInstallmentLabel
} from '../../../../core/utils/quotation-summary.util';

@Component({
  selector: 'app-quotation-detail',
  standalone: true,
  imports: [CommonModule, DataTableComponent, FinancialSummaryComponent, ButtonComponent],
  templateUrl: './quotation-detail.component.html'
})
export class QuotationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private quotationService = inject(QuotationService);
  private clientService = inject(ClientService);
  private vehicleService = inject(VehicleService);

  isLoading = signal(false);
  loadError = signal('');
  quotation = signal<Quotation | null>(null);
  client = signal<Client | null>(null);
  vehicle = signal<Vehicle | null>(null);

  columns: TableColumn[] = [
    { field: 'quotaNumber', header: '#' },
    { field: 'dueDate', header: 'Vencimiento' },
    { field: 'graceType', header: 'Gracia' },
    { field: 'initialBalance', header: 'Saldo Inicial' },
    { field: 'interest', header: 'Interés' },
    { field: 'amortization', header: 'Amortización' },
    { field: 'desgravamenInsurance', header: 'Seg. Desgravamen' },
    { field: 'vehicularInsurance', header: 'Seg. Vehicular' },
    { field: 'roadsideAssistance', header: 'Asist. Vial' },
    { field: 'extendedWarranty', header: 'Garantía Ext.' },
    { field: 'unemploymentInsurance', header: 'Seg. Desempleo' },
    { field: 'additionalExpenses', header: 'Gastos Adic.' },
    { field: 'monthlyQuota', header: 'Cuota' },
    { field: 'finalBalance', header: 'Saldo Final' }
  ];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/quotations']);
      return;
    }
    this.load(id);
  }

  private load(id: number) {
    this.isLoading.set(true);
    this.loadError.set('');

    this.quotationService.getQuotationById(id).subscribe({
      next: (quotation) => {
        this.quotation.set(quotation);
        this.isLoading.set(false);

        this.clientService.getClientById(String(quotation.clientId)).pipe(
          catchError(() => of(null))
        ).subscribe(client => this.client.set(client));

        this.vehicleService.getVehicles().pipe(
          catchError(() => of([]))
        ).subscribe(vehicles => {
          this.vehicle.set(vehicles.find(v => v.id === quotation.vehicleId) ?? null);
        });
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set('No se pudo cargar la cotización solicitada.');
      }
    });
  }

  goBack() {
    this.router.navigate(['/quotations']);
  }

  get clientName(): string {
    const client = this.client();
    if (client) return `${client.firstName} ${client.lastName}`;
    const q = this.quotation();
    return q ? `Cliente #${q.clientId}` : 'Ninguno';
  }

  get vehicleName(): string {
    const vehicle = this.vehicle();
    if (vehicle) return `${vehicle.brand} ${vehicle.model}`;
    const q = this.quotation();
    return q ? `Vehículo #${q.vehicleId}` : 'Ninguno';
  }

  formatMoney(value: number, currency: string): string {
    return formatMoney(value, currency);
  }

  formatGraceType(graceType: string): string {
    return formatGraceType(graceType);
  }

  get financing() {
    const q = this.quotation();
    if (!q) {
      return {
        totalPrice: 'S/ 0', downPayment: 'S/ 0', downPaymentPercent: '0%',
        financedAmount: 'S/ 0', term: '-', rateTypeLabel: 'TEA', rateValue: '0%',
        notaryFee: 'S/ 0', registryFee: 'S/ 0'
      };
    }
    return buildFinancingSummary(q);
  }

  get cokPercentLabel(): string {
    const q = this.quotation();
    return q ? formatPercent(q.cokPercentage) : '0.00%';
  }

  get vanLabel(): string {
    const q = this.quotation();
    return q ? formatMoney(q.van, q.currency) : 'S/ 0.00';
  }

  get tirLabel(): string {
    const q = this.quotation();
    return q ? formatPercent(q.tir) : '0.00%';
  }

  get tceaLabel(): string {
    const q = this.quotation();
    return q ? formatPercent(q.tcea) : '0.00%';
  }

  get regularInstallmentLabel(): string {
    const q = this.quotation();
    return q ? getRegularInstallmentLabel(q) : 'S/ 0.00';
  }

  get finalBalloonLabel(): string {
    const q = this.quotation();
    return q ? getFinalBalloonLabel(q) : '0';
  }
}
