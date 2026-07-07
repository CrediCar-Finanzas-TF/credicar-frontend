export interface Vehicle {
  id_vehiculo?: string;
  status?: string;
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
  sede?: string;
  stock?: number;
}

export interface VehicleResponse {
  id: number;
  businessId: string;
  brand: string;
  model: string;
  version: string;
  imageUrl: string;
  engine: string;
  transmission: string;
  combinedPower: string;
  traction: string;
  vehicleType: string;
  priceAmount: number;
  priceCurrency: string;
  stock: number;
  location: string;
}
