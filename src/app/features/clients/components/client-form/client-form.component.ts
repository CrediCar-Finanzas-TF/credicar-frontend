import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { SegmentedToggleComponent } from '../../../../shared/ui/segmented-toggle/segmented-toggle.component';
import { Client } from '../../../../core/models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, BadgeComponent, SegmentedToggleComponent],
  templateUrl: './client-form.component.html'
})
export class ClientFormComponent {
  documentTypes: Client['documentType'][] = ['DNI', 'CE', 'Pasaporte'];

  clientForm: FormGroup;

  continue = output<Client>();

  showValidationError = signal(false);

  constructor(private fb: FormBuilder) {
    this.clientForm = this.fb.group({
      documentType: ['DNI', Validators.required],
      documentNumber: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      company: [''],
      monthlyIncome: [null, [Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      laborSeniority: [null, [Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
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
  }
}