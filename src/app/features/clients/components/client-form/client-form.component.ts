import {Component, DestroyRef, inject, input, OnInit, output, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { SegmentedToggleComponent } from '../../../../shared/ui/segmented-toggle/segmented-toggle.component';
import { Client } from '../../../../core/models/client.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, BadgeComponent, SegmentedToggleComponent],
  templateUrl: './client-form.component.html'
})
export class ClientFormComponent implements OnInit {
  documentTypes: Client['documentType'][] = ['DNI', 'CE', 'Pasaporte'];

  title = input<string>('Nuevo cliente');

  clientForm: FormGroup;
  continue = output<Client>();
  documentNumberFocus = output<void>();

  showValidationError = signal(false);
  showNationality = signal(false); // Señal para controlar la UI

  private destroyRef = inject(DestroyRef);

  constructor(private fb: FormBuilder) {
    // Inicializamos con las validaciones por defecto para DNI
    this.clientForm = this.fb.group({
      documentType: ['DNI', Validators.required],
      documentNumber: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      nationality: [''], // Nuevo control
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      company: ['', Validators.required],
      monthlyIncome: [null, [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      laborSeniority: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
  }

  ngOnInit() {
    // Escuchamos los cambios en el tipo de documento
    this.clientForm.get('documentType')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((type) => this.onDocumentTypeChange(type));
  }

  private onDocumentTypeChange(type: string) {
    const docControl = this.clientForm.get('documentNumber');
    const natControl = this.clientForm.get('nationality');

    // Limpiamos valor y validadores previos
    docControl?.clearValidators();
    natControl?.clearValidators();

    if (type === 'DNI') {
      this.showNationality.set(false);
      docControl?.setValidators([Validators.required, Validators.pattern(/^\d{8}$/)]);
      natControl?.setValue('');
    } else if (type === 'CE') {
      this.showNationality.set(true);
      docControl?.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z0-9]{9}$/)]);
      natControl?.setValidators([Validators.required]);
    } else if (type === 'Pasaporte') {
      this.showNationality.set(true);
      docControl?.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z0-9]{5,15}$/)]);
      natControl?.setValidators([Validators.required]);
    }

    // Aplicamos los nuevos validadores al formulario
    docControl?.updateValueAndValidity();
    natControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.clientForm.valid) {
      this.showValidationError.set(false);
      this.continue.emit(this.clientForm.value as Client);
    } else {
      this.clientForm.markAllAsTouched();
      this.showValidationError.set(true);
    }
  }

  submitForm() {
    this.onSubmit();
  }

  patchValues(client: Client) {
    this.clientForm.patchValue(client);
    if (client.documentType) {
      this.onDocumentTypeChange(client.documentType);
    }
  }

  resetForm() {
    this.clientForm.reset({
      documentType: 'DNI',
      documentNumber: '',
      nationality: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      company: '',
      monthlyIncome: null,
      laborSeniority: null
    });
    this.showValidationError.set(false);
  }
}
