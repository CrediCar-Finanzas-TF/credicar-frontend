import { Component, input, output, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';

export interface TableColumn {
  field: string;
  header: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  template: `
    <div class="bg-surface border border-border-base p-6 rounded-none shadow-sm flex flex-col w-full transition-colors duration-300">

      <div
        class="overflow-x-auto"
        [class.overflow-y-auto]="!!maxHeight()"
        [style.max-height]="maxHeight() || null"
      >
        <table class="table-dark w-full" [ngClass]="minWidth()">
          <thead>
          <tr>
            @for (col of columns(); track col.field) {
              <th
                class="text-left"
                [class.sticky]="!!maxHeight()"
                [class.top-0]="!!maxHeight()"
                [class.z-10]="!!maxHeight()"
                [class.bg-surface-elevated]="!!maxHeight()"
              >{{ col.header }}</th>
            }
          </tr>
          </thead>
          <tbody>
            @if (isLoading()) {
              <tr>
                <td [colSpan]="columns().length" class="text-center py-10">
                  <div class="flex flex-col items-center justify-center gap-3">
                    <div class="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-sm text-text-muted">Cargando registros...</span>
                  </div>
                </td>
              </tr>
            }
            @else if (data().length === 0) {
              <tr>
                <td [colSpan]="columns().length" class="text-center py-10">
                  <span class="text-sm text-text-muted">No se encontraron resultados para tu búsqueda.</span>
                </td>
              </tr>
            }
            @else {
              @for (row of data() | slice:0:rowsLimit(); track row) {
                <tr class="hover:bg-surface-hover transition-colors" (click)="onRowSelect.emit(row)">
                  @for (col of columns(); track col.field) {
                    <td>
                      @if (bodyTemplate) {
                        <ng-container *ngTemplateOutlet="bodyTemplate; context: { $implicit: row, col: col }"></ng-container>
                      } @else {
                        <span class="text-sm text-text-secondary">{{ row[col.field] }}</span>
                      }
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      @if (showPagination()) {
        <app-pagination
          [startIndex]="1"
          [endIndex]="data().length < rowsLimit() ? data().length : rowsLimit()"
          [totalItems]="totalItems()"
          [itemName]="itemName()"
          (previous)="onPrevPage.emit()"
          (next)="onNextPage.emit()">
        </app-pagination>
      }

    </div>
  `
})
export class DataTableComponent {
  columns = input.required<TableColumn[]>();
  data = input.required<any[]>();
  isLoading = input<boolean>(false);
  totalItems = input<number>(0);
  itemName = input<string>('ítems');
  showPagination = input<boolean>(true);

  minWidth = input<string>('min-w-[800px]');
  rowsLimit = input<number>(5);
  maxHeight = input<string>('');

  onRowSelect = output<any>();
  onNextPage = output<void>();
  onPrevPage = output<void>();

  @ContentChild('bodyTpl') bodyTemplate!: TemplateRef<any>;
}
