import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../../ui/logo/logo.component';

interface MenuItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  template: `
    <aside class="w-[280px] h-screen bg-surface-elevated border-r border-border-base/50 flex flex-col justify-between select-none transition-colors duration-300">

      <div class="flex flex-col gap-6 p-6">
        <div class="flex items-center gap-3 text-text-primary transition-colors duration-300">
          <app-logo customClass="w-10 h-10"></app-logo>
          <h1 class="text-xl font-bold tracking-tight">CrediCar</h1>
        </div>

        <a
          routerLink="/simulations"
          class="flex items-center justify-center gap-2 w-full px-4 py-2.5 mt-2 rounded-none font-medium text-sm bg-transparent border border-border-base text-text-primary hover:bg-glass-hover transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
          <span>Nueva simulación</span>
        </a>
      </div>

      <nav class="flex-1 flex flex-col gap-1 px-3">
        @for (item of menuItems; track item.label) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-surface-hover text-text-primary !border-accent shadow-glow"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
            class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-secondary border-r-[3px] border-transparent hover:bg-surface-hover hover:text-text-primary transition-all duration-200"
          >
            <span class="flex items-center justify-center w-5 h-5">
              @switch (item.label) {
                @case ('Dashboard') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                }
                @case ('Clientes') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>
                }
                @case ('Vehículos') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8"/><path d="M7 14h.01"/><path d="M17 14h.01"/><rect width="18" height="8" x="3" y="10" rx="2"/><path d="M5 18v2"/><path d="M19 18v2"/></svg>
                }
                @case ('Operaciones') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/></svg>
                }
              }
            </span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <div class="flex flex-col border-t border-border-base/30">
        <a
          routerLink="/settings"
          routerLinkActive="bg-surface-hover text-text-primary !border-accent shadow-glow"
          class="flex items-center gap-3 px-7 py-4 text-sm font-medium text-text-secondary border-r-[3px] border-transparent hover:bg-surface-hover hover:text-text-primary transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>Configuración</span>
        </a>

        <div class="p-5 bg-surface flex items-center gap-3 border-t border-border-base/20 transition-colors duration-300">
          <img src="https://i.redd.it/who-has-the-best-lineup-icon-v0-mspllr4j9ncd1.jpg?width=1000&format=pjpg&auto=webp&s=86f5809f528a184b6ee72c81b889cbf9d357b2d7" alt="Alex Aquino" class="w-10 h-10 object-cover rounded-none border border-border-base">
          <div class="flex flex-col min-w-0">
            <span class="text-sm font-semibold text-text-primary truncate">Alex Aquino</span>
            <span class="text-xs text-text-muted truncate">Asesor Senior</span>
          </div>
        </div>
      </div>

    </aside>
  `
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Clientes', route: '/clients' },
    { label: 'Vehículos', route: '/vehicles' },
    { label: 'Operaciones', route: '/operations' }
  ];
}
