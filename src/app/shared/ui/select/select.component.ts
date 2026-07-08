import { Component, input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative w-full min-w-[140px]">
      <select
        [disabled]="disabled"
        [(ngModel)]="value"
        (ngModelChange)="onModelChange($event)"
        (blur)="onTouched()"
        class="w-full bg-surface border border-border-base text-text-primary text-sm rounded-none py-2.5 pl-4 pr-10 appearance-none focus:outline-none focus:border-border-strong focus:bg-surface-hover transition-colors cursor-pointer disabled:opacity-50"
      >
        <option value="" disabled selected class="text-text-muted">{{ placeholder() }}</option>
        @for (opt of options(); track opt) {
          <option [value]="opt" class="bg-surface text-text-primary">{{ opt }}</option>
        }
      </select>

      <div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  `
})
export class SelectComponent implements ControlValueAccessor {
  placeholder = input<string>('Seleccionar');
  options = input<string[]>([]);

  value: string = '';
  disabled: boolean = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void { this.value = value || ''; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }
  onModelChange(val: string) {
    this.value = val;
    this.onChange(val);
  }
}
