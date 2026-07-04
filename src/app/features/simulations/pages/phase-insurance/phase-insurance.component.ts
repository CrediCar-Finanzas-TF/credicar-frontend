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

const BASE_INSTALLMENT = 1850;

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
    return 'S/ ' + value.toLocaleString('en-US');
  }

  get additionalCosts(): SummaryCostLine[] {
    return this.coverages().map(coverage => ({
      label: coverage.title,
      value: coverage.active ? this.formatPrice(coverage.monthlyCost) : 'S/ 0'
    }));
  }

  get estimatedInstallmentLabel(): string {
    const activeCoveragesTotal = this.coverages()
      .filter(c => c.active)
      .reduce((sum, c) => sum + c.monthlyCost, 0);

    return this.formatPrice(BASE_INSTALLMENT + activeCoveragesTotal);
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
  }
}
