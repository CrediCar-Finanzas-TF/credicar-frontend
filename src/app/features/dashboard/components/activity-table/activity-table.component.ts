import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-activity-table',
  standalone: true,
  imports: [CommonModule, RouterModule, BadgeComponent, DataTableComponent],
  host: { class: 'flex flex-col flex-1 w-full h-full' },
  template: `
    <div class="flex flex-col flex-1 transition-colors duration-300">

      <div class="flex items-center justify-between p-6 bg-surface border-t border-l border-r border-border-base shadow-sm shrink-0">
        <h2 class="text-lg font-bold text-text-primary">Actividad Reciente</h2>
        <a routerLink="/operations" class="text-xs font-medium text-text-secondary border border-border-base px-3 py-1.5 hover:text-text-primary hover:bg-surface-hover transition-colors">
          Ver todo
        </a>
      </div>

      <app-data-table
        [columns]="cols"
        [data]="activities"
        [showPagination]="false"
        minWidth="min-w-[500px]"
        class="flex-1 flex flex-col [&>div]:border-t-0 [&>div]:flex-1 [&>div]:h-full"
      >
        <ng-template #bodyTpl let-row let-col="col">

          @if (col.field === 'client') {
            <span class="text-sm font-medium text-text-primary">{{ row.client }}</span>
          }

          @else if (col.field === 'status') {
            <app-badge>{{ row.status }}</app-badge>
          }

          @else if (col.field === 'action') {
            <div class="text-center w-full">
              <button class="text-text-muted hover:text-text-primary transition-colors focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          }

          @else {
            <span class="text-sm text-text-secondary">{{ row[col.field] }}</span>
          }

        </ng-template>
      </app-data-table>

    </div>
  `
})
export class ActivityTableComponent {
  cols = [
    { field: 'client', header: 'Cliente' },
    { field: 'vehicle', header: 'Vehículo' },
    { field: 'status', header: 'Estado' },
    { field: 'date', header: 'Fecha' },
    { field: 'action', header: 'Acción' }
  ];

  activities = [
    { client: 'Andrés Levano', vehicle: 'Kia Sportage', status: 'Cotizado', date: 'Hoy' },
    { client: 'Juan Pérez', vehicle: 'Toyota Corolla', status: 'Aprobado', date: 'Hoy' },
    { client: 'Luis Gómez', vehicle: 'Hyundai Tucson', status: 'Evaluación', date: 'Ayer' },
    { client: 'Ana Silva', vehicle: 'Mazda CX-5', status: 'Rechazado', date: '12 Oct' }
  ];
}
