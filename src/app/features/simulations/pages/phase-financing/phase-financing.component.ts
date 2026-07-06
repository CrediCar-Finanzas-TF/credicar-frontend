import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressStepperComponent } from '../../../../shared/components/progress-stepper/progress-stepper.component';
import { SimulationHeaderComponent } from '../../components/simulation-header/simulation-header.component';
import { SimulationFooterComponent } from '../../components/simulation-footer/simulation-footer.component';
import { FinancialSummaryComponent } from '../../components/financial-summary/financial-summary.component';
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
    TextareaComponent,
    SegmentedToggleComponent
  ],
  templateUrl: './phase-financing.component.html'
})
export class PhaseFinancingComponent implements OnInit {
  steps = ['Cliente', 'Vehículo', 'Financiamiento', 'Seguro', 'Resultado'];

  currencyOptions = ['S/', 'USD'];
  modalityOptions = ['Tradicional', 'Compra inteligente'];
  rateTypeOptions = ['Efectiva', 'Nominal'];
  capitalizationOptions = ['Diaria', 'Quincenal', 'Mensual', 'Bimestral', 'Trimestral', 'Semestral'];
  gracePeriodOptions = ['Parcial', 'Total'];
  installmentOptions = ['12 meses', '24 meses', '36 meses', '48 meses', '60 meses'];

  financingForm: FormGroup;
  private destroyRef = inject(DestroyRef);
  private updatingValues = false;

  exchangeRate = 3.410;
  originalPriceSoles = 0;

  baseNotarySoles = 480;
  baseRegistrySoles = 210;

  constructor(private fb: FormBuilder, private router: Router, protected simulationStore: SimulationStore) {
    this.originalPriceSoles = this.parsePrice(this.simulationStore.selectedVehicle()?.price ?? 'S/ 0');

    this.financingForm = this.fb.group({
      currency: ['S/'],
      vehiclePrice: [{ value: 0, disabled: true }],

      downPaymentAmount: [0, [Validators.required, Validators.min(0)]],
      downPaymentPercent: [20, [Validators.required, Validators.min(10), Validators.max(80)]],

      // Nuevos campos separados
      assetFinancedBalance: [{ value: 0, disabled: true }],
      totalLoanAmount: [{ value: 0, disabled: true }],

      installments: ['48 meses'],

      modality: ['Tradicional'],
      balloonAmount: [0],
      balloonPercent: [40],

      rateType: ['Efectiva'],
      rateValue: [14.5, [Validators.required, Validators.min(0.01)]],
      capitalization: ['Mensual'],

      gracePeriodType: ['Parcial'],
      gracePeriodMonthsParcial: [0],
      gracePeriodMonthsTotal: [0],

      cok: [12.5, [Validators.required, Validators.min(0)]],
      notaryFee: [this.baseNotarySoles, [Validators.required, Validators.min(0)]],
      registryFee: [this.baseRegistrySoles, [Validators.required, Validators.min(0)]],

      observations: ['']
    });
  }

  ngOnInit() {
    this.setupSyncLogic();
    this.recalculateAll();
  }

  private setupSyncLogic() {
    this.financingForm.get('currency')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newCurrency) => this.recalculateAll(newCurrency));

    this.financingForm.get('downPaymentPercent')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(pct => {
      if (this.updatingValues) return;
      this.updatingValues = true;
      const amount = this.currentBasePrice * ((Number(pct) || 0) / 100);
      this.financingForm.patchValue({ downPaymentAmount: amount.toFixed(2) }, { emitEvent: false });
      this.calculateFinancedAmount();
      this.updatingValues = false;
    });

    this.financingForm.get('downPaymentAmount')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(amt => {
      if (this.updatingValues) return;
      this.updatingValues = true;
      const pct = ((Number(amt) || 0) / this.currentBasePrice) * 100;
      this.financingForm.patchValue({ downPaymentPercent: pct.toFixed(2) }, { emitEvent: false });
      this.calculateFinancedAmount();
      this.updatingValues = false;
    });

    this.financingForm.get('balloonPercent')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(pct => {
      if (this.updatingValues) return;
      this.updatingValues = true;
      const amount = this.currentBasePrice * ((Number(pct) || 0) / 100);
      this.financingForm.patchValue({ balloonAmount: amount.toFixed(2) }, { emitEvent: false });
      this.updatingValues = false;
    });

    this.financingForm.get('balloonAmount')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(amt => {
      if (this.updatingValues) return;
      this.updatingValues = true;
      const pct = ((Number(amt) || 0) / this.currentBasePrice) * 100;
      this.financingForm.patchValue({ balloonPercent: pct.toFixed(2) }, { emitEvent: false });
      this.updatingValues = false;
    });

    this.financingForm.get('modality')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(mod => {
      const bPct = this.financingForm.get('balloonPercent');
      const bAmt = this.financingForm.get('balloonAmount');
      if (mod === 'Compra inteligente') {
        bPct?.setValidators([Validators.required, Validators.min(20), Validators.max(50)]);
        bAmt?.setValidators([Validators.required]);
      } else {
        bPct?.clearValidators();
        bAmt?.clearValidators();
      }
      bPct?.updateValueAndValidity();
      bAmt?.updateValueAndValidity();
    });

    this.financingForm.get('rateType')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(type => {
      const cap = this.financingForm.get('capitalization');
      if (type === 'Nominal') {
        cap?.setValidators([Validators.required]);
      } else {
        cap?.clearValidators();
      }
      cap?.updateValueAndValidity();
    });

    this.financingForm.get('notaryFee')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.calculateFinancedAmount());
    this.financingForm.get('registryFee')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.calculateFinancedAmount());

    this.financingForm.get('installments')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.clampGracePeriods());
    this.financingForm.get('gracePeriodMonthsTotal')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.clampGracePeriods());
    this.financingForm.get('gracePeriodMonthsParcial')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.clampGracePeriods());
  }

  private recalculateAll(newCurrency?: string) {
    this.updatingValues = true;

    const currentCurrency = newCurrency || this.financingForm.getRawValue().currency;
    const isUsd = currentCurrency === 'USD';

    const basePrice = isUsd ? this.originalPriceSoles / this.exchangeRate : this.originalPriceSoles;
    const notary = isUsd ? this.baseNotarySoles / this.exchangeRate : this.baseNotarySoles;
    const registry = isUsd ? this.baseRegistrySoles / this.exchangeRate : this.baseRegistrySoles;

    this.financingForm.patchValue({
      vehiclePrice: basePrice.toFixed(2),
      notaryFee: notary.toFixed(2),
      registryFee: registry.toFixed(2)
    }, { emitEvent: false });

    const currentInitPct = Number(this.financingForm.getRawValue().downPaymentPercent) || 20;
    const currentBalPct = Number(this.financingForm.getRawValue().balloonPercent) || 40;

    this.financingForm.patchValue({
      downPaymentAmount: (basePrice * (currentInitPct / 100)).toFixed(2),
      balloonAmount: (basePrice * (currentBalPct / 100)).toFixed(2)
    }, { emitEvent: false });

    this.updatingValues = false;
    this.calculateFinancedAmount();
  }

  private calculateFinancedAmount() {
    const price = Number(this.financingForm.getRawValue().vehiclePrice) || 0;
    const downPayment = Number(this.financingForm.getRawValue().downPaymentAmount) || 0;
    const notary = Number(this.financingForm.getRawValue().notaryFee) || 0;
    const registry = Number(this.financingForm.getRawValue().registryFee) || 0;

    // 1. Saldo a financiar del activo = Precio - Cuota Inicial
    const assetBalance = Math.max(price - downPayment, 0);

    // 2. Monto del préstamo = Saldo del activo + Costos iniciales
    const totalLoan = assetBalance + notary + registry;

    this.financingForm.patchValue({
      assetFinancedBalance: assetBalance.toFixed(2),
      totalLoanAmount: totalLoan.toFixed(2)
    }, { emitEvent: false });
  }

  private clampGracePeriods() {
    const max = this.maxGraceTotal;
    const totalCtrl = this.financingForm.get('gracePeriodMonthsTotal')!;
    const parcialCtrl = this.financingForm.get('gracePeriodMonthsParcial')!;

    let total = Number(totalCtrl.value) || 0;
    let parcial = Number(parcialCtrl.value) || 0;

    if (total > max) {
      total = max;
      totalCtrl.setValue(total, { emitEvent: false });
    }
    if (total + parcial > max) {
      parcial = Math.max(max - total, 0);
      parcialCtrl.setValue(parcial, { emitEvent: false });
    }
  }

  // --- GETTERS & HELPERS ---

  get currentSymbol(): string { return this.financingForm.getRawValue().currency === 'USD' ? '$' : 'S/'; }
  get currentBasePrice(): number { return Number(this.financingForm.getRawValue().vehiclePrice) || 0; }

  get rateTypeLabel(): string {
    return this.financingForm.getRawValue().rateType === 'Nominal' ? 'TNA' : 'TEA';
  }

  get rateValueLabel(): string {
    const val = this.financingForm.getRawValue().rateValue || 0;
    return this.financingForm.getRawValue().rateType === 'Nominal'
      ? `${val}% (Cap. ${this.financingForm.getRawValue().capitalization})`
      : `${val}%`;
  }

  get summaryBalloonAmount(): string {
    if (this.financingForm.getRawValue().modality !== 'Compra inteligente') return '0';
    return this.formatCurrency(Number(this.financingForm.getRawValue().balloonAmount) || 0);
  }

  private parsePrice(priceStr: string): number {
    return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
  }

  private formatCurrency(value: number): string {
    return `${this.currentSymbol} ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  get summaryVehiclePrice() { return this.formatCurrency(Number(this.financingForm.getRawValue().vehiclePrice) || 0); }
  get summaryDownPayment() { return this.formatCurrency(Number(this.financingForm.getRawValue().downPaymentAmount) || 0); }
  get summaryFinancedAmount() { return this.formatCurrency(Number(this.financingForm.getRawValue().totalLoanAmount) || 0); }
  get summaryNotary() { return this.formatCurrency(Number(this.financingForm.getRawValue().notaryFee) || 0); }
  get summaryRegistry() { return this.formatCurrency(Number(this.financingForm.getRawValue().registryFee) || 0); }

  get vehiclePriceLabel(): string { return this.summaryVehiclePrice; }
  get activeGracePeriodMonths(): number {
    return this.financingForm.getRawValue().gracePeriodType === 'Total'
      ? Number(this.financingForm.getRawValue().gracePeriodMonthsTotal) || 0
      : Number(this.financingForm.getRawValue().gracePeriodMonthsParcial) || 0;
  }

  get totalInstallmentsCount(): number { return parseInt(this.financingForm.getRawValue().installments, 10) || 0; }
  get maxGraceTotal(): number { return Math.min(Math.floor(this.totalInstallmentsCount * 0.25), 12); }
  get minServiceInstallments(): number { return Math.ceil(this.totalInstallmentsCount * 0.75); }

  get maxForTotalSlider(): number {
    return Math.max(this.maxGraceTotal - (Number(this.financingForm.getRawValue().gracePeriodMonthsParcial) || 0), 0);
  }

  get maxForParcialSlider(): number {
    return Math.max(this.maxGraceTotal - (Number(this.financingForm.getRawValue().gracePeriodMonthsTotal) || 0), 0);
  }

  get installmentBoxes(): { number: number; type: 'total' | 'parcial' | 'standard' }[] {
    const totalMonths = Number(this.financingForm.getRawValue().gracePeriodMonthsTotal) || 0;
    const parcialMonths = Number(this.financingForm.getRawValue().gracePeriodMonthsParcial) || 0;
    return Array.from({ length: Math.max(this.maxGraceTotal, 1) }, (_, i) => {
      const pos = i + 1;
      if (pos <= totalMonths) return { number: pos, type: 'total' as const };
      if (pos <= totalMonths + parcialMonths) return { number: pos, type: 'parcial' as const };
      return { number: pos, type: 'standard' as const };
    });
  }

  get clientName(): string | null {
    const client = this.simulationStore.selectedClient();
    return client ? `${client.firstName} ${client.lastName}` : null;
  }

  get vehicleName(): string | null { return this.simulationStore.selectedVehicle()?.model ?? null; }

  onBack() { this.router.navigate(['/simulations/vehicle']); }
  onFooterContinue() {
    if ((this.simulationStore as any).setFinancingData) {
      (this.simulationStore as any).setFinancingData({
        totalPrice: this.summaryVehiclePrice,
        downPayment: this.summaryDownPayment,
        downPaymentPercent: this.financingForm.getRawValue().downPaymentPercent + '%',
        financedAmount: this.summaryFinancedAmount, // Aquí enviamos el totalLoanAmount
        term: this.financingForm.getRawValue().installments,
        rateTypeLabel: this.rateTypeLabel,
        rateValue: this.rateValueLabel,
        balloonAmount: this.summaryBalloonAmount,
        notaryFee: this.summaryNotary,
        registryFee: this.summaryRegistry,
        baseInstallment: 1850
      });
    }
    this.router.navigate(['/simulations/insurance']);
  }
}
