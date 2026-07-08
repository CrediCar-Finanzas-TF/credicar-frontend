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
    <div class="bg-surface border border-border-base rounded-none p-6 flex flex-col gap-6 transition-colors duration-300 w-full lg:w-[360px]">
      <h3 class="text-xl font-semibold text-text-primary">Resumen de simulación</h3>

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
          <span class="text-sm text-text-secondary font-medium text-info">{{ rateTypeLabel() }}</span>
          <span class="text-sm font-semibold text-text-primary">{{ rateValue() }}</span>
        </div>

        @if (balloonAmount() && balloonAmount() !== '0' && balloonAmount() !== 'S/ 0.00' && balloonAmount() !== '$ 0.00') {
          <div class="flex justify-between items-center bg-warning/5 border border-warning/20 p-2 text-warning animate-fade-in">
            <span class="text-xs font-semibold uppercase tracking-wider">Cuota Final (Mes N)</span>
            <span class="text-sm font-bold">{{ balloonAmount() }}</span>
          </div>
        }
      </div>

      <div class="h-px bg-border-base"></div>

      <div class="flex flex-col gap-3">
        <h4 class="text-xs font-semibold text-text-secondary tracking-wider uppercase">Costos extras (Iniciales)</h4>
        <div class="flex justify-between items-center">
          <span class="text-sm text-text-secondary">Gastos notariales</span>
          <span class="text-sm font-medium text-text-primary">{{ notaryFee() }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-text-secondary">Gastos registrales</span>
          <span class="text-sm font-medium text-text-primary">{{ registryFee() }}</span>
        </div>
      </div>

      @if (additionalCosts().length > 0) {
        <div class="h-px bg-border-base"></div>
        <div class="flex flex-col gap-3 animate-fade-in">
          <h4 class="text-xs font-semibold text-text-secondary tracking-wider uppercase">Costos mensuales adicionales</h4>
          @for (cost of additionalCosts(); track cost.label) {
            <div class="flex justify-between items-center">
              <span class="text-sm text-text-secondary">{{ cost.label }}</span>
              <span class="text-sm font-medium text-text-primary">{{ cost.value }}</span>
            </div>
          }
        </div>
      }

      @if (showIndicators()) {
        <div class="h-px bg-border-base"></div>
        <div class="flex flex-col gap-2.5 bg-background/50 border border-border-base p-3.5 animate-fade-in">
          <h4 class="text-[10px] font-bold text-text-muted tracking-widest uppercase mb-1">Indicadores de rentabilidad</h4>
          <div class="flex justify-between items-center">
            <span class="text-xs text-text-secondary">VAN (COK: {{ cokPercent() }})</span>
            <span class="text-xs font-bold" [ngClass]="parseNumber(van()) >= 0 ? 'text-success' : 'text-danger'">{{ van() }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-text-secondary">TIR</span>
            <span class="text-xs font-semibold text-text-primary">{{ tir() }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-text-secondary">TCEA</span>
            <span class="text-sm font-bold text-text-primary">{{ tcea() }}</span>
          </div>
        </div>
      }

      <div class="h-px bg-border-base"></div>

      <div class="bg-surface-elevated border border-border-base rounded-none p-4 flex flex-col items-center gap-1 text-center">
        <span class="text-xs text-text-muted uppercase tracking-wide">Cuota mensual regular</span>
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

  // Nuevos inputs para desacoplar el tipo de tasa de su valor
  rateTypeLabel = input<string>('TEA');
  rateValue = input<string>('0%');

  // Nuevo input para la cuota balón
  balloonAmount = input<string>('S/ 0');

  notaryFee = input<string>('S/ 0');
  registryFee = input<string>('S/ 0');

  additionalCosts = input<SummaryCostLine[]>([]);
  estimatedInstallment = input<string>('S/ 0');

  // Lógica de indicadores financieros
  showIndicators = input<boolean>(false);
  cokPercent = input<string>('0%');
  van = input<string>('S/ 0.00');
  tir = input<string>('0.00%');
  tcea = input<string>('0.00%');

  parseNumber(value: string): number {
    return parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
  }
}
