import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProgressStepperComponent } from '../../../../shared/components/progress-stepper/progress-stepper.component';
import { SimulationHeaderComponent } from '../../components/simulation-header/simulation-header.component';
import { SimulationFooterComponent } from '../../components/simulation-footer/simulation-footer.component';
import { FinancialSummaryComponent } from '../../components/financial-summary/financial-summary.component';
import { DataTableComponent, TableColumn } from '../../../../shared/components/data-table/data-table.component';
import { SimulationStore } from '../../store/simulation.store';
import { QuotationService } from '../../services/quotation.service';
import { shortClientName } from '../../../../core/models/client.model';
import {
  buildFinancingSummary,
  formatGraceType,
  formatMoney,
  formatPercent,
  getFinalBalloonLabel,
  getRegularInstallmentLabel
} from '../../../../core/utils/quotation-summary.util';

@Component({
  selector: 'app-phase-result',
  standalone: true,
  imports: [
    CommonModule,
    ProgressStepperComponent,
    SimulationHeaderComponent,
    SimulationFooterComponent,
    FinancialSummaryComponent,
    DataTableComponent
  ],
  templateUrl: './phase-result.component.html'
})
export class PhaseResultComponent implements OnInit {
  private router = inject(Router);
  private quotationService = inject(QuotationService);
  protected simulationStore = inject(SimulationStore);

  steps = ['Cliente', 'Vehículo', 'Financiamiento', 'Seguro', 'Resultado'];

  isSaving = signal(false);
  saveError = signal('');

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
    // Esta fase solo existe dentro del flujo activo de simulación (preview en memoria).
    // Ver una cotización ya guardada es responsabilidad de /quotations/:id.
    if (!this.simulationStore.quotation()) {
      this.router.navigate(['/simulations/client']);
    }
  }

  onBackToInsurance() {
    this.router.navigate(['/simulations/insurance']);
  }

  onSaveQuotation() {
    const request = this.simulationStore.pendingQuotationRequest();
    if (!request || this.isSaving()) return;

    this.isSaving.set(true);
    this.saveError.set('');

    this.quotationService.createQuotation(request).subscribe({
      next: (quotation) => {
        this.isSaving.set(false);
        this.simulationStore.setQuotation(quotation);
        this.router.navigate(['/quotations', quotation.id]);
      },
      error: () => {
        this.isSaving.set(false);
        this.saveError.set('No se pudo guardar la cotización. Inténtalo de nuevo.');
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

  get footerClientName(): string | null {
    const client = this.simulationStore.selectedClient();
    return client ? shortClientName(client) : this.clientName;
  }

  get vehicleName(): string | null {
    const quotation = this.simulationStore.quotation();
    const vehicle = this.simulationStore.selectedVehicle();
    if (vehicle && quotation && vehicle.id === quotation.vehicleId) {
      return `${vehicle.brand} ${vehicle.model}`;
    }
    return quotation ? `Vehículo #${quotation.vehicleId}` : null;
  }

  formatMoney(value: number, currency: string): string {
    return formatMoney(value, currency);
  }

  formatGraceType(graceType: string): string {
    return formatGraceType(graceType);
  }

  get financing() {
    const q = this.simulationStore.quotation();
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
    const q = this.simulationStore.quotation();
    return q ? formatPercent(q.cokPercentage) : '0.00%';
  }

  get vanLabel(): string {
    const q = this.simulationStore.quotation();
    return q ? formatMoney(q.van, q.currency) : 'S/ 0.00';
  }

  get tirLabel(): string {
    const q = this.simulationStore.quotation();
    return q ? formatPercent(q.tir) : '0.00%';
  }

  get tceaLabel(): string {
    const q = this.simulationStore.quotation();
    return q ? formatPercent(q.tcea) : '0.00%';
  }

  get regularInstallmentLabel(): string {
    const q = this.simulationStore.quotation();
    return q ? getRegularInstallmentLabel(q) : 'S/ 0.00';
  }

  get finalBalloonLabel(): string {
    const q = this.simulationStore.quotation();
    return q ? getFinalBalloonLabel(q) : '0';
  }
}
