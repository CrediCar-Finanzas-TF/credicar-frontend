import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { ProgressStepperComponent } from '../../../../shared/components/progress-stepper/progress-stepper.component';
import { SimulationHeaderComponent } from '../../components/simulation-header/simulation-header.component';
import { SimulationFooterComponent } from '../../components/simulation-footer/simulation-footer.component';
import { FinancialSummaryComponent, SummaryCostLine } from '../../components/financial-summary/financial-summary.component';
import { InsuranceCoverageCardComponent } from '../../components/insurance-coverage-card/insurance-coverage-card.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { SimulationStore } from '../../store/simulation.store';
import { QuotationService } from '../../services/quotation.service';
import { ClientService } from '../../../clients/services/client.service';
import { Client, shortClientName } from '../../../../core/models/client.model';
import {
  CAPITALIZATION_MAP,
  CURRENCY_MAP,
  GRACE_TYPE_MAP,
  MODALITY_MAP,
  QuotationRequest,
  RATE_TYPE_MAP
} from '../../../../core/models/quotation.model';

interface OptionalCoverage {
  id: 'roadsideAssistance' | 'extendedWarranty' | 'unemploymentInsurance';
  title: string;
  description: string;
  monthlyCost: number;
  active: boolean;
}

@Component({
  selector: 'app-phase-insurance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProgressStepperComponent,
    SimulationHeaderComponent,
    SimulationFooterComponent,
    FinancialSummaryComponent,
    InsuranceCoverageCardComponent,
    InputComponent
  ],
  templateUrl: './phase-insurance.component.html'
})
export class PhaseInsuranceComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private quotationService = inject(QuotationService);
  private clientService = inject(ClientService);
  protected simulationStore = inject(SimulationStore);

  steps = ['Cliente', 'Vehículo', 'Financiamiento', 'Seguro', 'Resultado'];

  isSubmitting = signal(false);
  errorMessage = signal('');

  insuranceForm: FormGroup = this.fb.group({
    desgravamenRate: [0.05, [Validators.required, Validators.min(0)]],
    vehicularInsuranceMonthly: [240, [Validators.required, Validators.min(0)]]
  });

  optionalCoverages = signal<OptionalCoverage[]>([
    {
      id: 'roadsideAssistance',
      title: 'Asistencia Vial 24/7',
      description: 'Grúa, cambio de llanta, paso de corriente y auxilio mecánico en cualquier momento del día, en caso de imprevistos en la vía.',
      monthlyCost: 15,
      active: false
    },
    {
      id: 'extendedWarranty',
      title: 'Garantía Extendida del Vehículo',
      description: 'Cubre fallas mecánicas y eléctricas del vehículo una vez vencida la garantía de fábrica, sin costo adicional por reparación.',
      monthlyCost: 45,
      active: false
    },
    {
      id: 'unemploymentInsurance',
      title: 'Seguro de Desempleo',
      description: 'Cubre hasta 3 cuotas del crédito en caso de pérdida involuntaria del empleo, mientras el cliente encuentra una nueva fuente de ingresos.',
      monthlyCost: 25,
      active: false
    }
  ]);

  get clientName(): string | null {
    const client = this.simulationStore.selectedClient();
    return client ? `${client.firstName} ${client.lastName}` : null;
  }

  // Versión corta para el footer (espacio reducido): primer nombre + primer apellido.
  get footerClientName(): string | null {
    const client = this.simulationStore.selectedClient();
    return client ? shortClientName(client) : null;
  }

  get vehicleName(): string | null {
    const vehicle = this.simulationStore.selectedVehicle();
    return vehicle ? `${vehicle.brand} ${vehicle.model}` : null;
  }

  private get symbol(): string {
    return this.simulationStore.financingConfig()?.currency === 'USD' ? '$' : 'S/';
  }

  private formatCurrency(value: number): string {
    return `${this.symbol} ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatCoverageCost(value: number): string {
    return this.formatCurrency(value);
  }

  toggleCoverage(id: OptionalCoverage['id'], active: boolean) {
    this.optionalCoverages.update(list =>
      list.map(coverage => coverage.id === id ? { ...coverage, active } : coverage)
    );
  }

  private coverageCost(id: OptionalCoverage['id']): number {
    const coverage = this.optionalCoverages().find(c => c.id === id);
    return coverage?.active ? coverage.monthlyCost : 0;
  }

  // Reconstruye los datos de resumen a partir de la configuración cruda guardada por la fase de Financiamiento.
  get financing() {
    const config = this.simulationStore.financingConfig();

    if (!config) {
      return {
        totalPrice: this.simulationStore.selectedVehicle()?.price ?? 'S/ 0',
        downPayment: 'S/ 0',
        downPaymentPercent: '0%',
        financedAmount: 'S/ 0',
        term: '-',
        rateTypeLabel: 'TEA',
        rateValue: '0%',
        balloonAmount: '0',
        notaryFee: 'S/ 0',
        registryFee: 'S/ 0'
      };
    }

    const balloonAmount = config.modality === 'Compra inteligente'
      ? config.vehiclePrice * (config.balloonPercent / 100)
      : 0;

    return {
      totalPrice: this.formatCurrency(config.vehiclePrice),
      downPayment: this.formatCurrency(config.downPaymentAmount),
      downPaymentPercent: `${config.downPaymentPercent}%`,
      financedAmount: this.formatCurrency(config.financedAmount),
      term: `${config.totalQuotas} meses`,
      rateTypeLabel: config.rateType === 'Nominal' ? 'TNA' : 'TEA',
      rateValue: config.rateType === 'Nominal'
        ? `${config.rateValue}% (Cap. ${config.capitalization})`
        : `${config.rateValue}%`,
      balloonAmount: this.formatCurrency(balloonAmount),
      notaryFee: this.formatCurrency(config.notaryFee),
      registryFee: this.formatCurrency(config.registryFee)
    };
  }

  get additionalCosts(): SummaryCostLine[] {
    const config = this.simulationStore.financingConfig();
    const desgravamenRate = Number(this.insuranceForm.value.desgravamenRate) || 0;
    const vehicularMonthly = Number(this.insuranceForm.value.vehicularInsuranceMonthly) || 0;
    const desgravamenEstimate = (config?.financedAmount ?? 0) * (desgravamenRate / 100);

    const lines: SummaryCostLine[] = [
      { label: 'Seguro Desgravamen (aprox. 1ra cuota)', value: this.formatCurrency(desgravamenEstimate) },
      { label: 'Seguro Vehicular', value: this.formatCurrency(vehicularMonthly) }
    ];

    this.optionalCoverages().filter(c => c.active).forEach(c => {
      lines.push({ label: c.title, value: this.formatCurrency(c.monthlyCost) });
    });

    return lines;
  }

  // Estimado referencial (cuota francesa) mientras se confirma con el backend en /quotations.
  get estimatedInstallmentLabel(): string {
    const config = this.simulationStore.financingConfig();
    if (!config) return this.formatCurrency(0);

    const tem = this.calculateTEM(config.rateType, config.rateValue, config.capitalization);
    const amortizationPeriods = config.totalQuotas - config.gracePeriodMonths;
    if (amortizationPeriods <= 0) return this.formatCurrency(0);

    const baseQuota = config.financedAmount * tem / (1 - Math.pow(1 + tem, -amortizationPeriods));
    const desgravamenRate = Number(this.insuranceForm.value.desgravamenRate) || 0;
    const vehicularMonthly = Number(this.insuranceForm.value.vehicularInsuranceMonthly) || 0;
    const desgravamenEstimate = config.financedAmount * (desgravamenRate / 100);
    const optionalCoveragesTotal = this.optionalCoverages()
      .filter(c => c.active)
      .reduce((sum, c) => sum + c.monthlyCost, 0);

    return this.formatCurrency(baseQuota + vehicularMonthly + desgravamenEstimate + optionalCoveragesTotal);
  }

  private calculateTEM(rateType: string, percentage: number, capitalization: string): number {
    const rate = percentage / 100;
    if (rateType === 'Efectiva') return Math.pow(1 + rate, 1 / 12) - 1;

    const periods: Record<string, number> = { 'Diaria': 360, 'Mensual': 12, 'Trimestral': 4, 'Semestral': 2, 'Anual': 1 };
    const m = periods[capitalization] ?? 12;
    return Math.pow(1 + rate / m, m / 12) - 1;
  }

  onBack() {
    this.router.navigate(['/simulations/financing']);
  }

  onFooterContinue() {
    if (this.insuranceForm.invalid) {
      this.insuranceForm.markAllAsTouched();
      return;
    }

    const config = this.simulationStore.financingConfig();
    const client = this.simulationStore.selectedClient();
    const vehicle = this.simulationStore.selectedVehicle();

    if (!config || !client || !vehicle?.id) {
      this.errorMessage.set('Falta información del cliente, vehículo o financiamiento. Vuelve a las fases anteriores.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    // El cliente recién escrito (sin id) todavía no existe en la BD: se registra recién
    // al generar la cotización, no al continuar desde la fase 1.
    const ensureClient$ = client.id ? of(client) : this.clientService.createClient(client);

    ensureClient$.pipe(
      switchMap((resolvedClient: Client) => {
        this.simulationStore.setClient(resolvedClient);

        const request: QuotationRequest = {
          clientId: Number(resolvedClient.id),
          vehicleId: vehicle.id!,
          financingAmount: config.financedAmount,
          initialFee: config.downPaymentAmount,
          currency: CURRENCY_MAP[config.currency] ?? 'PEN',
          totalQuotas: config.totalQuotas,
          modality: MODALITY_MAP[config.modality] ?? 'TRADITIONAL',
          interestRateType: RATE_TYPE_MAP[config.rateType] ?? 'EFFECTIVE',
          interestRatePercentage: config.rateValue,
          capitalization: CAPITALIZATION_MAP[config.capitalization] ?? 'MONTHLY',
          gracePeriodType: GRACE_TYPE_MAP[config.gracePeriodType] ?? 'PARTIAL',
          gracePeriodMonths: config.gracePeriodMonths,
          desgravamenRate: Number(this.insuranceForm.value.desgravamenRate) || 0,
          vehicularInsuranceMonthly: Number(this.insuranceForm.value.vehicularInsuranceMonthly) || 0,
          roadsideAssistanceMonthly: this.coverageCost('roadsideAssistance'),
          extendedWarrantyMonthly: this.coverageCost('extendedWarranty'),
          unemploymentInsuranceMonthly: this.coverageCost('unemploymentInsurance'),
          // Notaría/registro no se financian: se cobran aparte como gasto inicial en la cuota 1
          // (additionalExpenses), sin generar interés y sin inflar el capital financiado.
          additionalExpenses: config.notaryFee + config.registryFee,
          // El backend aplica este % sobre financingAmount, pero la cuota balón se define como % del
          // PRECIO DEL VEHÍCULO (convención estándar de "Compra Inteligente"). Se ajusta la fracción
          // para que el monto resultante (financingAmount * fracción) sea igual a vehiclePrice * balloonPercent.
          balloonPaymentPercentage: config.modality === 'Compra inteligente'
            ? (config.vehiclePrice * (config.balloonPercent / 100)) / config.financedAmount
            : 0,
          cokPercentage: config.cok,
          notaryFee: config.notaryFee,
          registryFee: config.registryFee
        };

        this.simulationStore.setPendingQuotationRequest(request);
        return this.quotationService.previewQuotation(request);
      })
    ).subscribe({
      next: (quotation) => {
        this.isSubmitting.set(false);
        this.simulationStore.setQuotation(quotation);
        this.router.navigate(['/simulations/result']);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('No se pudo registrar el cliente o calcular la cotización. Verifica los datos e inténtalo de nuevo.');
      }
    });
  }
}
