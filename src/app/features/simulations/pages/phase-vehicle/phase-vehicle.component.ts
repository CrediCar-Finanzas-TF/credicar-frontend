import { Component } from '@angular/core';
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
import { SimulationStore } from '../../store/simulation.store';

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
export class PhaseVehicleComponent {
  steps = ['Cliente', 'Vehículo', 'Financiamiento', 'Seguro', 'Resultado'];

  searchQuery = '';

  brandOptions = ['Toyota', 'Mazda', 'Kia', 'Honda', 'Nissan'];
  modelOptions = ['Corolla Cross', 'CX-5', 'Sportage'];
  yearOptions = ['2026', '2025', '2024'];

  vehicles: Vehicle[] = [
    {
      id_vehiculo: 'V-8472',
      status: 'Disponible',
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=600&auto=format&fit=crop',
      brand: 'Toyota',
      model: 'Corolla Cross HEV',
      version: 'Hybrid Premium 2026',
      features: ['Automático', 'Híbrido', 'SUV'],
      price: 'S/ 95,000',
      motor: '1.8L Híbrido',
      transmision: 'E-CVT',
      potencia: '122 HP',
      traccion: 'FWD',
      sede: 'Sede Central - Lima',
      stock: 4
    },
    {
      id_vehiculo: 'V-1029',
      status: 'Disponible',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600&auto=format&fit=crop',
      brand: 'Mazda',
      model: 'CX-5 Signature',
      version: 'AWD 2025',
      features: ['Automático', 'Gasolina', 'AWD'],
      price: 'S/ 112,500',
      motor: '2.5L MPI',
      transmision: 'Automática 6 Vel.',
      potencia: '187 HP',
      traccion: 'AWD',
      sede: 'Sede Central - Lima',
      stock: 2
    },
    {
      id_vehiculo: 'V-4592',
      status: 'Disponible',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop',
      brand: 'Kia',
      model: 'Sportage GT-Line',
      version: '2025',
      features: ['Automático', 'Gasolina', 'SUV'],
      price: 'S/ 88,000',
      motor: '2.0L MPI',
      transmision: 'Automática 6 Vel.',
      potencia: '154 HP',
      traccion: 'FWD',
      sede: 'Sede Sur - Arequipa',
      stock: 3
    }
  ];

  constructor(private router: Router, protected simulationStore: SimulationStore) {}

  get clientName(): string | null {
    const client = this.simulationStore.selectedClient();
    return client ? `${client.firstName} ${client.lastName}` : null;
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