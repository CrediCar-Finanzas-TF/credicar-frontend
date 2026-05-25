import { Component, input, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="flex flex-col gap-1.5 w-full">
      @if (label()) {
        <label class="text-sm font-medium text-text-secondary">{{ label() }}</label>
      }

      <div class="relative flex items-center">
        @if (hasLeftIcon()) {
          <div class="absolute left-3.5 text-text-muted flex items-center justify-center pointer-events-none">
            <ng-content select="[left-icon]"></ng-content>
          </div>
        }

        <input
          [type]="isPassword() && !isPasswordVisible() ? 'password' : (isPassword() ? 'text' : type())"
          [placeholder]="placeholder()"
          [disabled]="disabled"
          [(ngModel)]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
          class="w-full bg-transparent border border-border-base text-text-primary text-sm rounded-none py-2.5 transition-all duration-200 focus:outline-none focus:border-border-strong focus:bg-white/5 disabled:opacity-50"
          [ngClass]="{
            'pl-10': hasLeftIcon(),
            'px-3.5': !hasLeftIcon(),
            'pr-10': isPassword()
          }"
        />

        @if (isPassword()) {
          <button
            type="button"
            (click)="togglePassword()"
            class="absolute right-3.5 text-text-muted hover:text-text-primary focus:outline-none transition-colors"
          >
            @if (isPasswordVisible()) {
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
            }
          </button>
        }
      </div>
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  hasLeftIcon = input<boolean>(false);
  isPassword = input<boolean>(false);

  isPasswordVisible = signal(false);
  value: string = '';
  disabled: boolean = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  togglePassword() {
    this.isPasswordVisible.update(v => !v);
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
  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }
}
