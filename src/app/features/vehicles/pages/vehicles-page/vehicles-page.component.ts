import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { SelectComponent } from '../../../../shared/ui/select/select.component';
import { VehicleCardComponent } from '../../components/vehicle-card/vehicle-card.component';
import { Vehicle } from '../../../../core/models/vehicle.model';
import {DrawerComponent} from '../../../../shared/components/drawer/drawer.component';

@Component({
  selector: 'app-vehicles-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MetricCardComponent,
    InputComponent,
    SelectComponent,
    VehicleCardComponent,
    DrawerComponent
  ],
  templateUrl: './vehicles-page.component.html'
})
export class VehiclesPageComponent {
  searchQuery: string = '';

  isDrawerOpen = false;
  selectedVehicle: Vehicle | null = null;

  openVehicleDetails(vehicle: Vehicle) {
    this.selectedVehicle = vehicle;
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    setTimeout(() => {
      this.selectedVehicle = null;
    }, 300);
  }

  brandOptions = ['Toyota', 'Kia', 'Mazda', 'Honda', 'Nissan'];
  modelOptions = ['Corolla', 'Sportage', 'CX-5', 'Civic'];
  yearOptions = ['2026', '2025', '2024', '2023'];

  vehicles: Vehicle[] = [
    {
      id_vehiculo: 'V-8472',
      status: 'Disponible',
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=600&auto=format&fit=crop',
      brand: 'Mercedes',
      model: 'Corolla Cross',
      version: 'Hybrid Premium 2026',
      features: ['Automático', 'Híbrido', 'SUV'],
      price: 'S/ 65,000',
      oldPrice: 'S/ 98,500',
      priceUsd: '$ 27,859',
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
      brand: 'RANGE ROVER',
      model: 'Sportage',
      version: 'GT-Line AWD 2025',
      features: ['Automático', 'Gasolina', 'SUV'],
      price: 'S/ 112,000',
      priceUsd: '$ 27,859',
      motor: '2.0L MPI',
      transmision: 'Automática 6 Vel.',
      potencia: '154 HP',
      traccion: 'AWD',
      sede: 'Sede Sur - Arequipa',
      stock: 2
    },
    {
      id_vehiculo: 'V-4592',
      status: 'Stock Bajo',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop',
      brand: 'CHEVROLET',
      model: 'CAMARO',
      version: 'Signature 2.5T 2025',
      features: ['Automático', 'Turbo', 'SUV'],
      price: 'S/ 125,500',
      priceUsd: '$ 27,859',
      motor: '2.5L Turbo',
      transmision: 'Automática 6 Vel.',
      potencia: '228 HP',
      traccion: 'AWD',
      sede: 'Sede Central - Lima',
      stock: 1
    }
  ];
}
