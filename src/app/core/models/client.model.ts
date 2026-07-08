export interface Client {
  id?: string;
  documentType: 'DNI' | 'CE' | 'Pasaporte';
  documentNumber: string;
  nationality?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  company: string;
  monthlyIncome: number | null;
  laborSeniority: number | null;
  creditScoreStatus?: 'Pendiente' | 'Aprobado' | 'Rechazado';
}

export interface ClientRequest {
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  streetAddress: string;
  company: string;
  monthlyIncome: number;
  seniorityYears: number;
}

// Refleja UpdateClientResource del backend: el documento no se puede modificar vía PUT.
export type UpdateClientRequest = Omit<ClientRequest, 'documentType' | 'documentNumber'>;

// Para mostrar en espacios reducidos (ej. footer de simulación): solo el primer nombre
// y el primer apellido, incluso si el cliente tiene nombres/apellidos compuestos.
export function shortClientName(client: Pick<Client, 'firstName' | 'lastName'>): string {
  const firstName = client.firstName.trim().split(/\s+/)[0] ?? '';
  const lastName = client.lastName.trim().split(/\s+/)[0] ?? '';
  return `${firstName} ${lastName}`.trim();
}

export interface ClientResponse extends ClientRequest {
  id: number;
}
