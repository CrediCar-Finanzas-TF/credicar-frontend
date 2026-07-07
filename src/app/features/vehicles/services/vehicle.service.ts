import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Vehicle, VehicleResponse } from '../../../core/models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/vehicles`;

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<VehicleResponse[]>(this.baseUrl).pipe(
      map(vehicles => vehicles.map(vehicle => this.toVehicle(vehicle)))
    );
  }

  private toVehicle(response: VehicleResponse): Vehicle {
    const isPen = response.priceCurrency === 'PEN';

    return {
      id: response.id,
      id_vehiculo: response.businessId ?? String(response.id),
      image: response.imageUrl,
      brand: response.brand,
      model: response.model,
      version: response.version,
      motor: response.engine,
      transmision: response.transmission,
      potencia: response.combinedPower,
      traccion: response.traction,
      features: [response.vehicleType, response.transmission].filter(Boolean),
      price: this.formatCurrency(response.priceAmount, response.priceCurrency),
      priceUsd: isPen ? this.formatCurrency(response.priceAmount / environment.exchangeRate, 'USD') : undefined,
      stock: response.stock,
      sede: response.location
    };
  }

  private formatCurrency(amount: number, currency: string): string {
    const symbol = currency === 'USD' ? '$' : 'S/';
    return `${symbol} ${Math.round(amount).toLocaleString('en-US')}`;
  }
}
