import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProgressStepperComponent } from '../../../../shared/components/progress-stepper/progress-stepper.component';
import { SimulationHeaderComponent } from '../../components/simulation-header/simulation-header.component';
import { SimulationFooterComponent } from '../../components/simulation-footer/simulation-footer.component';
import { FinancialSummaryComponent, SummaryCostLine } from '../../components/financial-summary/financial-summary.component';
import { InsuranceCoverageCardComponent } from '../../components/insurance-coverage-card/insurance-coverage-card.component';
import { InsuranceCoverage } from '../../models/insurance-coverage.model';
import { SimulationStore } from '../../store/simulation.store';

@Component({
  selector: 'app-phase-insurance',
  standalone: true,
  imports: [
    CommonModule,
    ProgressStepperComponent,
    SimulationHeaderComponent,
    SimulationFooterComponent,
    FinancialSummaryComponent,
    InsuranceCoverageCardComponent
  ],
  templateUrl: './phase-insurance.component.html'
})
export class PhaseInsuranceComponent {
  steps = ['Cliente', 'Vehículo', 'Financiamiento', 'Seguro', 'Resultado'];

  coverages = signal<InsuranceCoverage[]>([
    {
      id: 'desgravamen',
      title: 'Seguro de Desgravamen',
      description: 'Cubre el saldo deudor del crédito en caso de fallecimiento o invalidez total y permanente, garantizando la tranquilidad de tus beneficiarios.',
      monthlyCost: 85,
      mandatory: true,
      active: true
    },
    {
      id: 'vehicular-tr',
      title: 'Seguro Vehicular TR',
      description: 'Protección contra todo riesgo, incluyendo robo, choques y daños a terceros. Exigido por la entidad financiera mientras dure el crédito, ya que el vehículo es la garantía del préstamo.',
      monthlyCost: 240,
      mandatory: true,
      active: true
    },
    {
      id: 'asistencia-vial',
      title: 'Asistencia Vial 24/7',
      description: 'Grúa, cambio de llanta, paso de corriente y auxilio mecánico en cualquier momento del día, en caso de imprevistos en la vía.',
      monthlyCost: 15,
      mandatory: false,
      active: false
    },
    {
      id: 'garantia-extendida',
      title: 'Garantía Extendida del Vehículo',
      description: 'Cubre fallas mecánicas y eléctricas del vehículo una vez vencida la garantía de fábrica, sin costo adicional por reparación.',
      monthlyCost: 45,
      mandatory: false,
      active: false
    },
    {
      id: 'desempleo',
      title: 'Seguro de Desempleo',
      description: 'Cubre hasta 3 cuotas del crédito en caso de pérdida involuntaria del empleo, mientras el cliente encuentra una nueva fuente de ingresos.',
      monthlyCost: 25,
      mandatory: false,
      active: false
    }
  ]);

  constructor(private router: Router, protected simulationStore: SimulationStore) {}

  // Extraemos la configuración financiera del store
  get financing() {
    // Intenta leer del store (asegúrate de tener financingData en tu SimulationStore)
    const data = (this.simulationStore as any).financingData?.();

    // Fallback de seguridad si el store aún no tiene los datos guardados
    return data || {
      totalPrice: this.simulationStore.selectedVehicle()?.price ?? 'S/ 0',
      downPayment: 'S/ 0',
      downPaymentPercent: '0%',
      financedAmount: 'S/ 0',
      term: '48 meses',
      rateTypeLabel: 'TEA',
      rateValue: '0%',
      balloonAmount: '0',
      notaryFee: 'S/ 0',
      registryFee: 'S/ 0',
      baseInstallment: 1850 // Cuota base provisional
    };
  }

  get clientName(): string | null {
    const client = this.simulationStore.selectedClient();
    return client ? `${client.firstName} ${client.lastName}` : null;
  }

  get vehicleName(): string | null {
    return this.simulationStore.selectedVehicle()?.model ?? null;
  }

  toggleCoverage(id: string, active: boolean) {
    this.coverages.update(list =>
      list.map(coverage => coverage.id === id ? { ...coverage, active } : coverage)
    );
  }

  formatPrice(value: number): string {
    // Detectamos si la simulación está en dólares o soles leyendo el precio
    const symbol = this.financing.totalPrice.includes('$') ? '$' : 'S/';
    return `${symbol} ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Ahora solo mostramos los seguros que el usuario haya activado
  get additionalCosts(): SummaryCostLine[] {
    return this.coverages()
      .filter(coverage => coverage.active)
      .map(coverage => ({
        label: coverage.title,
        value: this.formatPrice(coverage.monthlyCost)
      }));
  }

  get estimatedInstallmentLabel(): string {
    const activeCoveragesTotal = this.coverages()
      .filter(c => c.active)
      .reduce((sum, c) => sum + c.monthlyCost, 0);

    const base = this.financing.baseInstallment || 1850;
    return this.formatPrice(base + activeCoveragesTotal);
  }

  onBack() {
    this.router.navigate(['/simulations/financing']);
  }

  onSkipInsurance() {
    this.coverages.update(list => list.map(c => c.mandatory ? c : { ...c, active: false }));
    this.proceedToResult();
  }

  onFooterContinue() {
    this.proceedToResult();
  }

  private proceedToResult() {
    console.log('Coberturas configuradas, continuar a fase Resultado:', this.coverages());
    // this.router.navigate(['/simulations/result']);
  }
}
