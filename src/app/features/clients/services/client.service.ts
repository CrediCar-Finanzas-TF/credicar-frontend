import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Client, ClientRequest, ClientResponse } from '../../../core/models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/clients`;

  createClient(client: Client): Observable<Client> {
    const request: ClientRequest = {
      documentType: client.documentType,
      documentNumber: client.documentNumber,
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone,
      email: client.email,
      streetAddress: client.address,
      company: client.company,
      monthlyIncome: client.monthlyIncome ?? 0,
      seniorityYears: client.laborSeniority ?? 0
    };

    return this.http.post<ClientResponse>(this.baseUrl, request).pipe(
      map(response => this.toClient(response))
    );
  }

  private toClient(response: ClientResponse): Client {
    return {
      id: String(response.id),
      documentType: response.documentType as Client['documentType'],
      documentNumber: response.documentNumber,
      firstName: response.firstName,
      lastName: response.lastName,
      phone: response.phone,
      email: response.email,
      address: response.streetAddress,
      company: response.company,
      monthlyIncome: response.monthlyIncome,
      laborSeniority: response.seniorityYears
    };
  }
}
