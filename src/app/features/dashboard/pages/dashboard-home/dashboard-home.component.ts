import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card.component';
import { WelcomeBannerComponent } from '../../components/welcome-banner/welcome-banner.component';
import { ActivityTableComponent } from '../../components/activity-table/activity-table.component';
import { PendingOperationsComponent } from '../../components/pending-operations/pending-operations.component';

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
export class DashboardHomeComponent {}
