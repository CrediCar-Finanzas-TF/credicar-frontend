import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProgressStepperComponent } from '../../../../shared/components/progress-stepper/progress-stepper.component';
import { SimulationHeaderComponent } from '../../components/simulation-header/simulation-header.component';
import { FinancialSummaryComponent } from '../../components/financial-summary/financial-summary.component';
import { DataTableComponent, TableColumn } from '../../../../shared/components/data-table/data-table.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { SimulationStore } from '../../store/simulation.store';
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
  protected simulationStore = inject(SimulationStore);

  steps = ['Cliente', 'Vehículo', 'Financiamiento', 'Seguro', 'Resultado'];

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
    if (!this.simulationStore.quotation()) {
      this.router.navigate(['/simulations/client']);
    }
  }

  get clientName(): string | null {
    const client = this.simulationStore.selectedClient();
    return client ? `${client.firstName} ${client.lastName}` : null;
  }

  get vehicleName(): string | null {
    return this.simulationStore.selectedVehicle()?.model ?? null;
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

  get financing() {
    const config = this.simulationStore.financingConfig();
    return {
      totalPrice: config ? this.formatMoney(config.vehiclePrice, this.quotationCurrency) : 'S/ 0',
      downPayment: config ? this.formatMoney(config.downPaymentAmount, this.quotationCurrency) : 'S/ 0',
      downPaymentPercent: config ? `${config.downPaymentPercent}%` : '0%',
      financedAmount: this.simulationStore.quotation()
        ? this.formatMoney(this.simulationStore.quotation()!.financingAmount, this.quotationCurrency)
        : 'S/ 0',
      term: config ? `${config.totalQuotas} meses` : '-',
      rateTypeLabel: config?.rateType === 'Nominal' ? 'TNA' : 'TEA',
      rateValue: config
        ? (config.rateType === 'Nominal' ? `${config.rateValue}% (Cap. ${config.capitalization})` : `${config.rateValue}%`)
        : '0%',
      notaryFee: config ? this.formatMoney(config.notaryFee, this.quotationCurrency) : 'S/ 0',
      registryFee: config ? this.formatMoney(config.registryFee, this.quotationCurrency) : 'S/ 0',
      cokPercent: config ? `${config.cok}%` : '0%'
    };
  }

  private get quotationCurrency(): string {
    return this.simulationStore.quotation()?.currency ?? 'PEN';
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
    const regular = q.schedule.find((item: PaymentScheduleItem) => item.graceType === 'NONE') ?? q.schedule[q.schedule.length - 1];
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
