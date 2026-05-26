import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { ChipComponent } from '../../../../shared/ui/chip/chip.component';

@Component({
  selector: 'app-clients-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MetricCardComponent,
    InputComponent,
    BadgeComponent,
    ChipComponent
  ],
  templateUrl: './clients-page.component.html'
})
export class ClientsPageComponent {
  searchQuery: string = '';

  clients = Array(6).fill({
    initials: 'AL',
    name: 'Andrés Levano Mejía',
    dni: '76392740',
    phone: '+51 982 913 103',
    status: 'Cotizado',
    lastUpdate: 'HACE 1 HORA'
  });
}
