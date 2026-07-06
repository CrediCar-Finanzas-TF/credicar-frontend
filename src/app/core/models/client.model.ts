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
