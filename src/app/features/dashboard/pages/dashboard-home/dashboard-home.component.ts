import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card.component';
import { WelcomeBannerComponent } from '../../components/welcome-banner/welcome-banner.component';
import { ActivityTableComponent } from '../../components/activity-table/activity-table.component';
import { PendingOperationsComponent } from '../../components/pending-operations/pending-operations.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ClientService } from '../../../clients/services/client.service';
import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { QuotationService } from '../../../simulations/services/quotation.service';
import { Client } from '../../../../core/models/client.model';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    MetricCardComponent,
    WelcomeBannerComponent,
    ActivityTableComponent,
    PendingOperationsComponent
  ],
  templateUrl: './dashboard-home.component.html',
  styles: [`
    .marquee-container {
      display: flex;
      white-space: nowrap;
      animation: marquee 15s linear infinite;
    }
    @keyframes marquee {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
  `]
})
export class DashboardHomeComponent implements OnInit {
  authService = inject(AuthService);
  private clientService = inject(ClientService);
  private vehicleService = inject(VehicleService);
  private quotationService = inject(QuotationService);

  totalClients = signal(0);
  totalQuotations = signal(0);
  totalFinancedLabel = signal('S/ 0.00');
  vehicleStockTotal = signal(0);

  ngOnInit() {
    this.vehicleService.getVehicles().pipe(
      catchError(() => of([]))
    ).subscribe(vehicles => {
      this.vehicleStockTotal.set(vehicles.reduce((sum, vehicle) => sum + (vehicle.stock ?? 0), 0));
    });

    this.clientService.searchClientsPage('', 0, 1000).pipe(
      catchError(() => of({ content: [] as Client[], totalElements: 0 }))
    ).subscribe(page => {
      this.totalClients.set(page.totalElements);

      if (page.content.length === 0) {
        this.totalQuotations.set(0);
        return;
      }

      const requests = page.content.map(client =>
        this.quotationService.getQuotationsByClient(Number(client.id)).pipe(catchError(() => of([])))
      );

      forkJoin(requests).subscribe(quotationsPerClient => {
        const allQuotations = quotationsPerClient.flat();
        this.totalQuotations.set(allQuotations.length);

        const total = allQuotations.reduce((sum, quotation) => sum + quotation.financingAmount, 0);
        this.totalFinancedLabel.set(`S/ ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      });
    });
  }
}
