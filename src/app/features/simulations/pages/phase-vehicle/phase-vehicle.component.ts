import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgressStepperComponent } from '../../../../shared/components/progress-stepper/progress-stepper.component';
import { SimulationHeaderComponent } from '../../components/simulation-header/simulation-header.component';
import { SimulationFooterComponent } from '../../components/simulation-footer/simulation-footer.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { SelectComponent } from '../../../../shared/ui/select/select.component';
import { VehicleCardComponent } from '../../../vehicles/components/vehicle-card/vehicle-card.component';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { shortClientName } from '../../../../core/models/client.model';
import { SimulationStore } from '../../store/simulation.store';
import { VehicleService } from '../../../vehicles/services/vehicle.service';

@Component({
  selector: 'app-phase-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProgressStepperComponent,
    SimulationHeaderComponent,
    SimulationFooterComponent,
    InputComponent,
    SelectComponent,
    VehicleCardComponent
  ],
  templateUrl: './phase-vehicle.component.html'
})
export class PhaseVehicleComponent implements OnInit {
  private vehicleService = inject(VehicleService);

  steps = ['Cliente', 'Vehículo', 'Financiamiento', 'Seguro', 'Resultado'];

  searchQuery = '';

  brandOptions = ['Toyota', 'Mazda', 'Kia', 'Honda', 'Nissan'];
  modelOptions = ['Corolla Cross', 'CX-5', 'Sportage'];
  yearOptions = ['2026', '2025', '2024'];

  isLoading = signal(false);
  vehicles = signal<Vehicle[]>([]);

  constructor(private router: Router, protected simulationStore: SimulationStore) {}

  ngOnInit() {
    this.isLoading.set(true);
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles.set(vehicles);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  get clientName(): string | null {
    const client = this.simulationStore.selectedClient();
    return client ? shortClientName(client) : null;
  }

  get vehicleName(): string | null {
    const vehicle = this.simulationStore.selectedVehicle();
    return vehicle ? `${vehicle.brand} ${vehicle.model}` : null;
  }

  selectVehicle(vehicle: Vehicle) {
    this.simulationStore.setVehicle(vehicle);
  }

  onBack() {
    this.router.navigate(['/simulations/client']);
  }

  onFooterContinue() {
    const vehicle = this.simulationStore.selectedVehicle();
    if (vehicle) {
      this.router.navigate(['/simulations/financing']);
    }
  }
}
