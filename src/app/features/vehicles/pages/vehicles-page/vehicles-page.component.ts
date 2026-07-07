import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { SelectComponent } from '../../../../shared/ui/select/select.component';
import { VehicleCardComponent } from '../../components/vehicle-card/vehicle-card.component';
import { Vehicle } from '../../../../core/models/vehicle.model';
import {DrawerComponent} from '../../../../shared/components/drawer/drawer.component';
import { VehicleService } from '../../services/vehicle.service';

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
export class VehiclesPageComponent implements OnInit {
  private vehicleService = inject(VehicleService);

  searchQuery: string = '';

  isDrawerOpen = false;
  selectedVehicle: Vehicle | null = null;

  isLoading = signal(false);
  vehicles = signal<Vehicle[]>([]);

  brandOptions = ['Toyota', 'Kia', 'Mazda', 'Honda', 'Nissan'];
  modelOptions = ['Corolla', 'Sportage', 'CX-5', 'Civic'];
  yearOptions = ['2026', '2025', '2024', '2023'];

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
}
