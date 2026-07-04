import { Injectable, signal } from '@angular/core';
import { Client } from '../../../core/models/client.model';
import { Vehicle } from '../../../core/models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class SimulationStore {
  selectedClient = signal<Client | null>(null);
  selectedVehicle = signal<Vehicle | null>(null);

  setClient(client: Client) {
    this.selectedClient.set(client);
  }

  setVehicle(vehicle: Vehicle) {
    this.selectedVehicle.set(vehicle);
  }
}