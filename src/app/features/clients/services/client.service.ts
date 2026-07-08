import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Client, ClientRequest, ClientResponse, UpdateClientRequest } from '../../../core/models/client.model';
import { PageResponse } from '../../../core/models/pagination.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/clients`;

  searchClients(search: string, page = 0, size = 20): Observable<Client[]> {
    return this.searchClientsPage(search, page, size).pipe(
      map(pageResponse => pageResponse.content)
    );
  }

  searchClientsPage(search: string, page = 0, size = 20): Observable<PageResponse<Client>> {
    const params = new HttpParams()
      .set('search', search)
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<ClientResponse>>(this.baseUrl, { params }).pipe(
      map(pageResponse => ({
        ...pageResponse,
        content: pageResponse.content.map(response => this.toClient(response))
      }))
    );
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<ClientResponse>(`${this.baseUrl}/${id}`).pipe(
      map(response => this.toClient(response))
    );
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<ClientResponse>(this.baseUrl, this.toRequest(client)).pipe(
      map(response => this.toClient(response))
    );
  }

  updateClient(id: string, client: Client): Observable<Client> {
    return this.http.put<ClientResponse>(`${this.baseUrl}/${id}`, this.toUpdateRequest(client)).pipe(
      map(response => this.toClient(response))
    );
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  private toRequest(client: Client): ClientRequest {
    return {
      documentType: client.documentType,
      documentNumber: client.documentNumber,
      ...this.toUpdateRequest(client)
    };
  }

  // El documento no se puede modificar vía PUT (UpdateClientResource del backend no lo acepta).
  private toUpdateRequest(client: Client): UpdateClientRequest {
    return {
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone,
      email: client.email,
      streetAddress: client.address,
      company: client.company,
      monthlyIncome: client.monthlyIncome ?? 0,
      seniorityYears: client.laborSeniority ?? 0
    };
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
