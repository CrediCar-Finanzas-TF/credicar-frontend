import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressStepperComponent } from '../../../../shared/components/progress-stepper/progress-stepper.component';
import { SimulationHeaderComponent } from '../../components/simulation-header/simulation-header.component';
import { FinancialSummaryComponent } from '../../components/financial-summary/financial-summary.component';
import { DataTableComponent, TableColumn } from '../../../../shared/components/data-table/data-table.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { SimulationStore } from '../../store/simulation.store';
import { QuotationService } from '../../services/quotation.service';
import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { CURRENCY_SYMBOL, PaymentScheduleItem } from '../../../../core/models/quotation.model';

@Component({
  selector: 'app-phase-result',
  standalone: true,
  imports: [
    CommonModule,
    ProgressStepperComponent,
    SimulationHeaderComponent,
    FinancialSummaryComponent,
    DataTableComponent,
    ButtonComponent
  ],
  templateUrl: './phase-result.component.html'
})
export class PhaseResultComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private quotationService = inject(QuotationService);
  private vehicleService = inject(VehicleService);
  protected simulationStore = inject(SimulationStore);

  steps = ['Cliente', 'Vehículo', 'Financiamiento', 'Seguro', 'Resultado'];

  isLoading = signal(false);
  loadError = signal('');

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
    const quotationId = this.route.snapshot.paramMap.get('quotationId');

    if (quotationId) {
      this.loadHistoricalQuotation(Number(quotationId));
      return;
    }

    if (!this.simulationStore.quotation()) {
      this.router.navigate(['/simulations/client']);
    }
  }

  // Permite abrir esta pantalla directamente desde /clients (fuera del flujo de simulación),
  // recargando la cotización guardada en vez de depender del store en memoria.
  private loadHistoricalQuotation(quotationId: number) {
    this.isLoading.set(true);
    this.loadError.set('');

    this.quotationService.getQuotationById(quotationId).subscribe({
      next: (quotation) => {
        this.simulationStore.setQuotation(quotation);

        this.vehicleService.getVehicles().subscribe({
          next: (vehicles) => {
            const vehicle = vehicles.find(v => v.id === quotation.vehicleId);
            if (vehicle) this.simulationStore.setVehicle(vehicle);
            this.isLoading.set(false);
          },
          error: () => this.isLoading.set(false)
        });
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set('No se pudo cargar la cotización solicitada.');
      }
    });
  }

  get clientName(): string | null {
    const quotation = this.simulationStore.quotation();
    const client = this.simulationStore.selectedClient();
    if (client && quotation && Number(client.id) === quotation.clientId) {
      return `${client.firstName} ${client.lastName}`;
    }
    return quotation ? `Cliente #${quotation.clientId}` : null;
  }

  get vehicleName(): string | null {
    const quotation = this.simulationStore.quotation();
    const vehicle = this.simulationStore.selectedVehicle();
    if (vehicle && quotation && vehicle.id === quotation.vehicleId) {
      return vehicle.model;
    }
    return quotation ? `Vehículo #${quotation.vehicleId}` : null;
  }

  formatMoney(value: number, currency: string): string {
    const symbol = CURRENCY_SYMBOL[currency] ?? currency;
    return `${symbol} ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatGraceType(graceType: string): string {
    switch (graceType) {
      case 'TOTAL': return 'Total';
      case 'PARTIAL': return 'Parcial';
      default: return 'Sin gracia';
    }
  }

  private formatPercent(value: number): string {
    return `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
  }

  // Se deriva íntegramente de la cotización (funciona tanto recién generada como cargada del historial).
  get financing() {
    const q = this.simulationStore.quotation();

    if (!q) {
      return {
        totalPrice: 'S/ 0', downPayment: 'S/ 0', downPaymentPercent: '0%',
        financedAmount: 'S/ 0', term: '-', rateTypeLabel: 'TEA', rateValue: '0%',
        notaryFee: 'S/ 0', registryFee: 'S/ 0'
      };
    }

    const vehiclePrice = q.financingAmount + q.initialFee;
    const downPaymentPercent = vehiclePrice > 0 ? (q.initialFee / vehiclePrice) * 100 : 0;
    // Notaría/registro ya no están dentro de financingAmount, así que se suman aparte para el precio total real.
    const totalOperation = vehiclePrice + q.notaryFee + q.registryFee;

    return {
      totalPrice: this.formatMoney(totalOperation, q.currency),
      downPayment: this.formatMoney(q.initialFee, q.currency),
      downPaymentPercent: `${downPaymentPercent.toFixed(0)}%`,
      financedAmount: this.formatMoney(q.financingAmount, q.currency),
      term: `${q.totalQuotas} meses`,
      rateTypeLabel: q.interestRateType === 'NOMINAL' ? 'TNA' : 'TEA',
      rateValue: q.interestRateType === 'NOMINAL'
        ? `${q.interestRatePercentage}% (Cap. ${q.capitalization})`
        : `${q.interestRatePercentage}%`,
      notaryFee: this.formatMoney(q.notaryFee, q.currency),
      registryFee: this.formatMoney(q.registryFee, q.currency)
    };
  }

  get cokPercentLabel(): string {
    const q = this.simulationStore.quotation();
    return q ? this.formatPercent(q.cokPercentage) : '0.00%';
  }

  get vanLabel(): string {
    const q = this.simulationStore.quotation();
    return q ? this.formatMoney(q.van, q.currency) : 'S/ 0.00';
  }

  get tirLabel(): string {
    const q = this.simulationStore.quotation();
    return q ? this.formatPercent(q.tir) : '0.00%';
  }

  get tceaLabel(): string {
    const q = this.simulationStore.quotation();
    return q ? this.formatPercent(q.tcea) : '0.00%';
  }

  get regularInstallmentLabel(): string {
    const q = this.simulationStore.quotation();
    if (!q || q.schedule.length === 0) return 'S/ 0.00';
    // Se excluyen cuotas con additionalExpenses (ej. cuota 1 con notaría/registro) para
    // no mostrar un cargo único como si fuera la cuota "regular" del crédito.
    const regular = q.schedule.find((item: PaymentScheduleItem) => item.graceType === 'NONE' && item.additionalExpenses === 0)
      ?? q.schedule.find((item: PaymentScheduleItem) => item.graceType === 'NONE')
      ?? q.schedule[q.schedule.length - 1];
    return this.formatMoney(regular.monthlyQuota, regular.currency);
  }

  get finalBalloonLabel(): string {
    const q = this.simulationStore.quotation();
    if (!q || q.modality !== 'SMART' || q.schedule.length === 0) return '0';
    const last = q.schedule[q.schedule.length - 1];
    return this.formatMoney(last.monthlyQuota, last.currency);
  }

  onNewSimulation() {
    this.router.navigate(['/simulations/client']);
  }
}
