import { Injectable, signal } from '@angular/core';
import { Client } from '../../../core/models/client.model';
import { Vehicle } from '../../../core/models/vehicle.model';
import { Quotation, QuotationRequest } from '../../../core/models/quotation.model';
import { FinancingConfig } from '../models/financing.model';

@Injectable({ providedIn: 'root' })
export class SimulationStore {
  selectedClient = signal<Client | null>(null);
  selectedVehicle = signal<Vehicle | null>(null);
  financingConfig = signal<FinancingConfig | null>(null);
  quotation = signal<Quotation | null>(null);

  // Request armado en la fase de Seguro, usado tal cual para el preview y, recién al
  // confirmar en Resultado, para el POST /quotations real (evita rearmar todo de nuevo).
  pendingQuotationRequest = signal<QuotationRequest | null>(null);

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

  setPendingQuotationRequest(request: QuotationRequest) {
    this.pendingQuotationRequest.set(request);
  }
}
