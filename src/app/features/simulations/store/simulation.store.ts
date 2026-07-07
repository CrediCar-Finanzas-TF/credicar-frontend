import { Injectable, signal } from '@angular/core';
import { Client } from '../../../core/models/client.model';
import { Vehicle } from '../../../core/models/vehicle.model';
import { Quotation } from '../../../core/models/quotation.model';
import { FinancingConfig } from '../models/financing.model';

@Injectable({ providedIn: 'root' })
export class SimulationStore {
  selectedClient = signal<Client | null>(null);
  selectedVehicle = signal<Vehicle | null>(null);
  financingConfig = signal<FinancingConfig | null>(null);
  quotation = signal<Quotation | null>(null);

  setClient(client: Client) {
    this.selectedClient.set(client);
  }

  setVehicle(vehicle: Vehicle) {
    this.selectedVehicle.set(vehicle);
  }

  setFinancingConfig(config: FinancingConfig) {
    this.financingConfig.set(config);
  }

  setQuotation(quotation: Quotation) {
    this.quotation.set(quotation);
  }
}
