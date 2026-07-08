import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { SelectComponent } from '../../../../shared/ui/select/select.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { VehicleCardComponent } from '../../components/vehicle-card/vehicle-card.component';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { DrawerComponent } from '../../../../shared/components/drawer/drawer.component';
import { VehicleService } from '../../services/vehicle.service';
import { ClientService } from '../../../clients/services/client.service';
import { QuotationService } from '../../../simulations/services/quotation.service';

@Component({
  selector: 'app-vehicles-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MetricCardComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent,
    VehicleCardComponent,
    DrawerComponent
  ],
  templateUrl: './vehicles-page.component.html'
})
export class VehiclesPageComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private clientService = inject(ClientService);
  private quotationService = inject(QuotationService);

  searchQuery = '';
  selectedBrand = '';
  selectedModel = '';

  isDrawerOpen = false;
  selectedVehicle: Vehicle | null = null;

  isLoading = signal(false);
  vehicles = signal<Vehicle[]>([]);

  // No hay endpoint para "todas las cotizaciones" ni fecha de creación en Quotation,
  // así que se suma el histórico completo por cliente (no se puede acotar a 30 días).
  totalQuotations = signal<number | null>(null);

  ngOnInit() {
    this.isLoading.set(true);
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles.set(vehicles);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });

    this.loadTotalQuotations();
  }

  private loadTotalQuotations() {
    this.clientService.searchClientsPage('', 0, 1000).subscribe({
      next: (page) => {
        if (page.content.length === 0) {
          this.totalQuotations.set(0);
          return;
        }

        const requests = page.content.map(client =>
          this.quotationService.getQuotationsByClient(Number(client.id)).pipe(
            catchError(() => of([]))
          )
        );

        forkJoin(requests).subscribe(results => {
          this.totalQuotations.set(results.reduce((sum, list) => sum + list.length, 0));
        });
      },
      error: () => this.totalQuotations.set(null)
    });
  }

  get brandOptions(): string[] {
    return Array.from(new Set(this.vehicles().map(v => v.brand))).sort();
  }

  get modelOptions(): string[] {
    const source = this.selectedBrand
      ? this.vehicles().filter(v => v.brand === this.selectedBrand)
      : this.vehicles();
    return Array.from(new Set(source.map(v => v.model))).sort();
  }

  get filteredVehicles(): Vehicle[] {
    const query = this.searchQuery.trim().toLowerCase();

    return this.vehicles().filter(vehicle => {
      const matchesQuery = !query || `${vehicle.brand} ${vehicle.model} ${vehicle.version}`.toLowerCase().includes(query);
      const matchesBrand = !this.selectedBrand || vehicle.brand === this.selectedBrand;
      const matchesModel = !this.selectedModel || vehicle.model === this.selectedModel;
      return matchesQuery && matchesBrand && matchesModel;
    });
  }

  get brandsAvailableCount(): number {
    return this.brandOptions.length;
  }

  get stockTotal(): number {
    return this.vehicles().reduce((sum, v) => sum + (v.stock ?? 0), 0);
  }

  get activeModelsCount(): number {
    return new Set(this.vehicles().map(v => v.model)).size;
  }

  onBrandChange(brand: string) {
    this.selectedBrand = brand;
    // Cascada: si el modelo elegido no pertenece a la nueva marca, se limpia.
    if (this.selectedModel && !this.modelOptions.includes(this.selectedModel)) {
      this.selectedModel = '';
    }
  }

  get hasActiveFilters(): boolean {
    return !!(this.searchQuery || this.selectedBrand || this.selectedModel);
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedBrand = '';
    this.selectedModel = '';
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
