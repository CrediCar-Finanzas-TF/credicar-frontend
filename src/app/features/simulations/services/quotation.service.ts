import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Quotation, QuotationRequest } from '../../../core/models/quotation.model';
import { PageResponse } from '../../../core/models/pagination.model';

@Injectable({ providedIn: 'root' })
export class QuotationService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/quotations`;

  createQuotation(request: QuotationRequest): Observable<Quotation> {
    return this.http.post<Quotation>(this.baseUrl, request);
  }

  // Calcula cronograma/VAN/TIR/TCEA sin guardar nada (id vuelve null): se usa mientras
  // el usuario revisa el resultado, antes de confirmar con "Guardar cotización".
  previewQuotation(request: QuotationRequest): Observable<Quotation> {
    return this.http.post<Quotation>(`${this.baseUrl}/preview`, request);
  }

  getQuotationsByClient(clientId: number): Observable<Quotation[]> {
    return this.http.get<Quotation[]>(`${this.baseUrl}/client/${clientId}`);
  }

  getQuotationById(quotationId: number): Observable<Quotation> {
    return this.http.get<Quotation>(`${this.baseUrl}/${quotationId}`);
  }

  // Pendiente en el backend: hoy solo existen GET /quotations/client/{id} y GET /quotations/{id}.
  getAllQuotations(page = 0, size = 200): Observable<PageResponse<Quotation>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Quotation>>(this.baseUrl, { params });
  }
}
