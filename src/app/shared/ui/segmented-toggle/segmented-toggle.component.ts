import { Component, input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-segmented-toggle',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SegmentedToggleComponent),
      multi: true
    }
  ],
  template: `
    @if (buttonStyle()) {
      <div class="flex flex-wrap gap-2">
        @for (opt of options(); track opt) {
          <button
            type="button"
            [disabled]="disabled"
            (click)="select(opt)"
            class="px-4 py-1.5 text-sm font-medium rounded-full border transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            [ngClass]="value === opt
              ? 'bg-accent text-background border-accent'
              : 'bg-transparent text-text-secondary border-border-base hover:border-border-strong'"
          >
            {{ opt }}
          </button>
        }
      </div>
    } @else {
      <div class="relative flex bg-surface-elevated border border-border-base rounded-full p-1">
        <div
          class="absolute left-1 top-1 bottom-1 rounded-full bg-glass-hover border border-glass-border-strong shadow-sm transition-transform duration-300 ease-out"
          [style.width]="'calc((100% - 0.5rem) / ' + options().length + ')'"
          [style.transform]="'translateX(' + (selectedIndex() * 100) + '%)'"
        ></div>

        @for (opt of options(); track opt) {
          <button
            type="button"
            [disabled]="disabled"
            (click)="select(opt)"
            class="relative z-10 flex-1 py-2.5 text-sm font-medium rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            [ngClass]="value === opt ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'"
          >
            {{ opt }}
          </button>
        }
      </div>
    }
  `
})
export class SegmentedToggleComponent implements ControlValueAccessor {
  options = input<string[]>([]);
  buttonStyle = input<boolean>(false);

  value: string = '';
  disabled: boolean = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  selectedIndex(): number {
    return this.options().indexOf(this.value);
  }

  select(opt: string) {
    if (this.disabled) return;
    this.value = opt;
    this.onChange(opt);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value || '';
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
}
