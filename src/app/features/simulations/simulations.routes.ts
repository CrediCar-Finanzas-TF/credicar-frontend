import { Routes } from '@angular/router';

export const simulationsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'client',
    pathMatch: 'full'
  },
  {
    path: 'client',
    loadComponent: () => import('./pages/phase-client/phase-client.component').then(m => m.PhaseClientComponent)
  },
  {
    path: 'vehicle',
    loadComponent: () => import('./pages/phase-vehicle/phase-vehicle.component').then(m => m.PhaseVehicleComponent)
  },
  {
    path: 'financing',
    loadComponent: () => import('./pages/phase-financing/phase-financing.component').then(m => m.PhaseFinancingComponent)
  },
  {
    path: 'insurance',
    loadComponent: () => import('./pages/phase-insurance/phase-insurance.component').then(m => m.PhaseInsuranceComponent)
  },
  {
    path: 'result',
    loadComponent: () => import('./pages/phase-result/phase-result.component').then(m => m.PhaseResultComponent)
  },
  {
    path: 'result/:quotationId',
    loadComponent: () => import('./pages/phase-result/phase-result.component').then(m => m.PhaseResultComponent)
  }
];