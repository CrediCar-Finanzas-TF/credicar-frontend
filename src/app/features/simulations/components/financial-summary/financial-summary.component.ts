import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SummaryCostLine {
  label: string;
  value: string;
}

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-surface border border-border-base rounded-md p-6 flex flex-col gap-6 transition-colors duration-300">
      <h3 class="text-xl font-semibold text-text-primary">Resumen</h3>

      <div class="flex flex-col gap-1">
        <span class="text-xs text-text-muted">Cliente</span>
        <span class="text-lg font-bold text-text-primary">{{ clientName() }}</span>
      </div>

      <div class="h-px bg-border-base"></div>

      <div class="flex flex-col gap-1">
        <span class="text-xs text-text-muted">Vehículo</span>
        <span class="text-lg font-bold text-text-primary">{{ vehicleName() }}</span>
      </div>

      <div class="h-px bg-border-base"></div>

      <div class="flex flex-col gap-3">
        <div class="flex justify-between items-center">
          <span class="text-sm text-text-secondary">Precio total</span>
          <span class="text-sm font-semibold text-text-primary">{{ totalPrice() }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-text-secondary">Cuota inicial ({{ downPaymentPercent() }})</span>
          <span class="text-sm font-semibold text-text-primary">{{ downPayment() }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-text-secondary">Monto a financiar</span>
          <span class="text-sm font-semibold text-text-primary">{{ financedAmount() }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-text-secondary">Plazo</span>
          <span class="text-sm font-semibold text-text-primary">{{ term() }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-text-secondary">TEA</span>
          <span class="text-sm font-semibold text-text-primary">{{ tea() }}</span>
        </div>
      </div>

      <div class="h-px bg-border-base"></div>

      <div class="flex flex-col gap-3">
        <h4 class="text-xs font-semibold text-text-secondary tracking-wider uppercase">Costos extras</h4>
        <div class="flex justify-between items-center">
          <span class="text-sm text-text-secondary">Gastos notariales</span>
          <span class="text-sm font-medium text-text-primary">{{ notaryFee() }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-text-secondary">Gastos registrales</span>
          <span class="text-sm font-medium text-text-primary">{{ registryFee() }}</span>
        </div>
      </div>

      <div class="h-px bg-border-base"></div>

      <div class="flex flex-col gap-3">
        <h4 class="text-xs font-semibold text-text-secondary tracking-wider uppercase">Costos mensuales adicionales</h4>
        @for (cost of additionalCosts(); track cost.label) {
          <div class="flex justify-between items-center">
            <span class="text-sm text-text-secondary">{{ cost.label }}</span>
            <span class="text-sm font-medium text-text-primary">{{ cost.value }}</span>
          </div>
        }
      </div>

      <div class="h-px bg-border-base"></div>

      <div class="bg-surface-elevated border border-border-base rounded-md p-4 flex flex-col items-center gap-1 text-center">
        <span class="text-xs text-text-muted uppercase tracking-wide">Cuota estimada</span>
        <span class="text-2xl font-bold text-text-primary">{{ estimatedInstallment() }}</span>
      </div>
    </div>
  `
})
export class FinancialSummaryComponent {
  clientName = input<string>('Ninguno');
  vehicleName = input<string>('Ninguno');

  totalPrice = input<string>('S/ 0');
  downPayment = input<string>('S/ 0');
  downPaymentPercent = input<string>('0%');
  financedAmount = input<string>('S/ 0');
  term = input<string>('-');
  tea = input<string>('-');

  notaryFee = input<string>('S/ 0');
  registryFee = input<string>('S/ 0');

  additionalCosts = input<SummaryCostLine[]>([]);

  estimatedInstallment = input<string>('S/ 0');
}
