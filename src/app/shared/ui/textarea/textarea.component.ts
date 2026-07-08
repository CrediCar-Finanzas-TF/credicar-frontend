import { Component, input, forwardRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  template: `
    <div class="flex flex-col gap-1.5 w-full">
      @if (label()) {
        <label class="text-sm font-medium text-text-secondary">{{ label() }}</label>
      }

      <textarea
        #textareaEl
        [placeholder]="placeholder()"
        [disabled]="disabled"
        [rows]="rows()"
        [(ngModel)]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
        class="w-full bg-transparent border border-border-base text-text-primary text-sm px-3.5 py-2.5 resize-none overflow-hidden transition-all duration-200 focus:outline-none focus:border-border-strong focus:bg-glass-hover disabled:opacity-50"
        [ngClass]="rounded() ? 'rounded-md' : 'rounded-none'"
      ></textarea>
    </div>
  `
})
export class TextareaComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('textareaEl') textareaEl!: ElementRef<HTMLTextAreaElement>;

  label = input<string>('');
  placeholder = input<string>('');
  rows = input<number>(5);
  rounded = input<boolean>(false);

  value: string = '';
  disabled: boolean = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  ngAfterViewInit() {
    this.resize();
  }

  writeValue(value: any): void {
    this.value = value || '';
    this.resize();
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
    const val = (event.target as HTMLTextAreaElement).value;
    this.value = val;
    this.onChange(val);
    this.resize();
  }

  private resize() {
    const el = this.textareaEl?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }
}
