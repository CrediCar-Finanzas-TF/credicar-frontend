import { Component, input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true
    }
  ],
  template: `
    <label class="inline-flex items-center gap-2.5" [ngClass]="disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'">
      <span
        class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200"
        [ngClass]="value ? 'bg-info border-info' : 'bg-surface-elevated border-border-base'"
      >
        <input
          type="checkbox"
          class="absolute opacity-0 w-0 h-0"
          [disabled]="disabled"
          [(ngModel)]="value"
          (ngModelChange)="onModelChange($event)"
          (blur)="onTouched()"
        >
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200"
          [ngClass]="value ? 'translate-x-6' : 'translate-x-1'"
        ></span>
      </span>

      @if (label()) {
        <span class="text-sm font-medium text-text-primary">{{ label() }}</span>
      }
    </label>
  `
})
export class SwitchComponent implements ControlValueAccessor {
  label = input<string>('');

  value: boolean = false;
  disabled: boolean = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = !!value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  onModelChange(val: boolean) {
    this.value = val;
    this.onChange(val);
  }
}
