import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './core/layouts/dashboard-layout/dashboard-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/pages/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent)
      },
      {
        path: 'clients',
        loadComponent: () => import('./features/clients/pages/clients-page/clients-page.component').then(m => m.ClientsPageComponent)
      },
      {
        path: 'help',
        loadComponent: () => import('./features/help/pages/help-page/help-page.component').then(m => m.HelpPageComponent)
      },
      {
        path: 'vehicles',
        loadComponent: () => import('./features/vehicles/pages/vehicles-page/vehicles-page.component').then(m => m.VehiclesPageComponent)
      },
      {
        path: 'quotations',
        loadComponent: () => import('./features/quotations/pages/quotations-page/quotations-page.component').then(m => m.QuotationsPageComponent)
      },
      {
        path: 'quotations/:id',
        loadComponent: () => import('./features/quotations/pages/quotation-detail/quotation-detail.component').then(m => m.QuotationDetailComponent)
      },
      {
        path: 'simulations',
        loadChildren: () => import('./features/simulations/simulations.routes').then(m => m.simulationsRoutes)
      }
    ]
  }
];
