import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { Vehicle } from '../../../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div
      (dblclick)="onViewDetail.emit(vehicle())"
      class="bg-surface border border-border-base flex flex-col rounded-none group transition-colors duration-300 hover:border-border-strong shadow-sm h-full w-full select-none cursor-pointer"
    >

      <div class="relative h-48 w-full overflow-hidden bg-background">
        <span class="absolute top-3 left-3 px-2 py-1 text-[10px] uppercase tracking-wider font-medium border border-border-base bg-black/60 text-white backdrop-blur-md z-10">
          {{ vehicle().status }}
        </span>

        <img [src]="vehicle().image" [alt]="vehicle().model" class="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500">

        <div class="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-50"></div>
      </div>

      <div class="p-6 flex flex-col flex-1">

        <span class="text-[10px] text-text-muted tracking-widest uppercase mb-1">{{ vehicle().brand }}</span>
        <h3 class="text-xl font-bold text-text-primary">{{ vehicle().model }}</h3>
        <p class="text-sm text-text-secondary mb-5">{{ vehicle().version }}</p>

        <div class="flex flex-wrap gap-2 mb-6">
          @for (feat of vehicle().features; track feat) {
            <span class="px-2 py-1 text-[9px] border border-border-base text-text-secondary uppercase tracking-wide">{{ feat }}</span>
          }
        </div>

        @if (selectable()) {
          <div class="mt-auto flex flex-col gap-3 border-t border-border-base/40 pt-5">
            <div class="flex flex-col">
              <span class="text-xs text-text-muted mb-0.5">Precio base desde</span>
              <span class="text-lg font-bold text-text-primary">{{ vehicle().price }}</span>
            </div>

            <app-button variant="outline" [fullWidth]="true" (click)="onSelect.emit(vehicle())">
              Seleccionar vehículo
            </app-button>
          </div>
        } @else {
          <div class="mt-auto flex justify-between items-end border-t border-border-base/40 pt-5">
            <div class="flex flex-col">
              <span class="text-xs text-text-muted mb-0.5">Desde</span>
              <span class="text-lg font-bold text-text-primary">{{ vehicle().price }}</span>
            </div>

            <app-button
              variant="outline"
              class="[&>button]:px-4 [&>button]:py-1.5 [&>button]:text-xs"
              (click)="onViewDetail.emit(vehicle())"
            >
              Ver detalle
            </app-button>
          </div>
        }

      </div>
    </div>
  `
})
export class VehicleCardComponent {
  vehicle = input.required<Vehicle>();
  selectable = input<boolean>(false);

  onViewDetail = output<Vehicle>();
  onSelect = output<Vehicle>();
}
