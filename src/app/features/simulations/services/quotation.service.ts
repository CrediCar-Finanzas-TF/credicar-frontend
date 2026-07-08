import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Quotation, QuotationRequest } from '../../../core/models/quotation.model';

@Injectable({ providedIn: 'root' })
export class QuotationService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/quotations`;

  createQuotation(request: QuotationRequest): Observable<Quotation> {
    return this.http.post<Quotation>(this.baseUrl, request);
  }

  getQuotationsByClient(clientId: number): Observable<Quotation[]> {
    return this.http.get<Quotation[]>(`${this.baseUrl}/client/${clientId}`);
  }

  getQuotationById(quotationId: number): Observable<Quotation> {
    return this.http.get<Quotation>(`${this.baseUrl}/${quotationId}`);
  }
}
