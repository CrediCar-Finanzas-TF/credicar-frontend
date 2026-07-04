import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgressStepperComponent } from '../../../../shared/components/progress-stepper/progress-stepper.component';
import { SimulationHeaderComponent } from '../../components/simulation-header/simulation-header.component';
import { SimulationFooterComponent } from '../../components/simulation-footer/simulation-footer.component';
import { FinancialSummaryComponent, SummaryCostLine } from '../../components/financial-summary/financial-summary.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { SelectComponent } from '../../../../shared/ui/select/select.component';
import { SegmentedToggleComponent } from '../../../../shared/ui/segmented-toggle/segmented-toggle.component';
import { TextareaComponent } from '../../../../shared/ui/textarea/textarea.component';
import { SimulationStore } from '../../store/simulation.store';

@Component({
  selector: 'app-phase-financing',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProgressStepperComponent,
    SimulationHeaderComponent,
    SimulationFooterComponent,
    FinancialSummaryComponent,
    InputComponent,
    SelectComponent,
    SegmentedToggleComponent,
    TextareaComponent
  ],
  templateUrl: './phase-financing.component.html'
})
export class PhaseFinancingComponent {
  steps = ['Cliente', 'Vehículo', 'Financiamiento', 'Seguro', 'Resultado'];

  currencyOptions = ['S/', 'USD'];
  modalityOptions = ['Compra inteligente', 'Tradicional'];
  rateTypeOptions = ['Efectiva', 'Nominal'];
  gracePeriodOptions = ['Sin gracia', 'Parcial', 'Total'];
  installmentOptions = ['12 meses', '24 meses', '36 meses', '48 meses', '60 meses'];

  financingForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, protected simulationStore: SimulationStore) {
    const defaultDownPayment = 15000;

    this.financingForm = this.fb.group({
      vehiclePrice: [{ value: this.vehiclePriceLabel, disabled: true }],
      currency: ['S/'],
      downPayment: [defaultDownPayment],
      financedAmount: [{ value: this.formatPrice(Math.max(this.vehiclePriceValue - defaultDownPayment, 0)), disabled: true }],
      installments: ['48 meses'],
      firstPaymentDate: [''],
      modality: ['Compra inteligente'],
      rateType: ['Efectiva'],
      rateValue: [14.5],
      gracePeriodType: ['Parcial'],
      gracePeriodMonths: [2],
      observations: ['']
    });
  }

  get vehiclePriceValue(): number {
    const price = this.simulationStore.selectedVehicle()?.price ?? 'S/ 0';
    return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
  }

  get vehiclePriceLabel(): string {
    return this.simulationStore.selectedVehicle()?.price ?? 'S/ 0';
  }

  get downPaymentLabel(): string {
    return this.formatPrice(Number(this.financingForm.value.downPayment) || 0);
  }

  get downPaymentPercentLabel(): string {
    const price = this.vehiclePriceValue;
    const downPayment = Number(this.financingForm.value.downPayment) || 0;
    if (!price) return '0%';
    return ((downPayment / price) * 100).toFixed(1) + '%';
  }

  get teaLabel(): string {
    return (Number(this.financingForm.value.rateValue) || 0) + '%';
  }

  get estimatedInsuranceCosts(): SummaryCostLine[] {
    return [
      { label: 'Seguro desgravamen', value: 'S/ 85 aprox.' },
      { label: 'Seguro vehicular', value: 'S/ 240 aprox.' }
    ];
  }

  get clientName(): string | null {
    const client = this.simulationStore.selectedClient();
    return client ? `${client.firstName} ${client.lastName}` : null;
  }

  get vehicleName(): string | null {
    return this.simulationStore.selectedVehicle()?.model ?? null;
  }

  formatPrice(value: number): string {
    return 'S/ ' + value.toLocaleString('en-US');
  }

  onBack() {
    this.router.navigate(['/simulations/vehicle']);
  }

  onFooterContinue() {
    this.router.navigate(['/simulations/insurance']);
  }
}