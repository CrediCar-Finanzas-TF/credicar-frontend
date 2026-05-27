import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { ChipComponent } from '../../../../shared/ui/chip/chip.component';
import {DataTableComponent} from '../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-operations-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MetricCardComponent,
    InputComponent,
    BadgeComponent,
    ChipComponent,
    DataTableComponent
  ],
  templateUrl: './operations-page.component.html'
})
export class OperationsPageComponent {
  searchQuery: string = '';

  cols = [
    { field: 'code', header: 'Código' },
    { field: 'client', header: 'Cliente' },
    { field: 'amount', header: 'Monto' },
    { field: 'status', header: 'Estado' },
    { field: 'lastUpdate', header: 'Última Actualización' }
  ];

  operations = [
    { code: 'OP-2026-089', client: 'Carlos Mendoza', amount: 'S/ 45,000', status: 'Cotizado', lastUpdate: 'HACE 1 HORA' },
    { code: 'OP-2026-039', client: 'Juan Pérez', amount: 'S/ 22,000', status: 'Evaluación', lastUpdate: 'HACE 1 HORA' },
    { code: 'OP-2026-184', client: 'Maria Torres', amount: 'S/ 15,000', status: 'Rechazado', lastUpdate: 'HACE 1 HORA' },
    { code: 'OP-2026-752', client: 'Empresa Logística SA', amount: 'S/ 59,000', status: 'Cotizado', lastUpdate: 'HACE 1 HORA' },
    { code: 'OP-2025-957', client: 'Diego Vilca', amount: 'S/ 62,000', status: 'Evaluación', lastUpdate: 'HACE 1 HORA' },
    { code: 'OP-2025-418', client: 'Camilo Párraga', amount: 'S/ 9,000', status: 'Cotizado', lastUpdate: 'HACE 1 HORA' },
    { code: 'OP-2025-875', client: 'Andrés Levano', amount: 'S/ 42,000', status: 'Evaluación', lastUpdate: 'HACE 1 HORA' },
    { code: 'OP-2025-937', client: 'Christian Torpoco', amount: 'S/ 31,000', status: 'Cotizado', lastUpdate: 'HACE 1 HORA' },
    { code: 'OP-2025-121', client: 'José Pereira', amount: 'S/ 46,000', status: 'Cotizado', lastUpdate: 'HACE 1 HORA' }
  ];

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
