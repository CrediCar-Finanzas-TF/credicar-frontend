export interface Vehicle {
  id_vehiculo?: string;
  status: string;
  image: string;
  brand: string;
  model: string;
  version: string;
  price: string;
  oldPrice?: string;
  priceUsd?: string;
  features: string[];
  motor: string;
  transmision: string;
  potencia: string;
  traccion: string;
  sede: string;
  stock: number;
}
