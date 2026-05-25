import { Component, input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  template: `
    <label class="flex items-start gap-2.5 cursor-pointer group w-fit">
      <div
        class="relative flex items-center justify-center w-4 h-4 rounded-none border transition-all duration-200 mt-0.5 shrink-0"
        [ngClass]="{
          'bg-accent border-accent': value,
          'bg-transparent border-border-base group-hover:border-border-strong': !value,
          'opacity-50 cursor-not-allowed': disabled
        }"
      >
        <input
          type="checkbox"
          class="absolute opacity-0 w-0 h-0"
          [disabled]="disabled"
          [(ngModel)]="value"
          (ngModelChange)="onModelChange($event)"
          (blur)="onTouched()"
        >

        @if (value) {
          <svg class="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        }
      </div>

      @if (label()) {
        <span class="text-sm text-text-secondary select-none group-hover:text-text-primary transition-colors leading-snug">
          {{ label() }}
        </span>
      }
    </label>
  `
})
export class CheckboxComponent implements ControlValueAccessor {
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
