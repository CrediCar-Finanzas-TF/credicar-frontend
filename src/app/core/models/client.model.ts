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

export interface ClientResponse extends ClientRequest {
  id: number;
}
