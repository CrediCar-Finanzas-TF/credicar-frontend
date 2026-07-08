import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-surface border border-border-base p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors duration-300 shadow-sm">
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
          Bienvenido, {{ userName() }}
        </h1>
        <p class="text-sm md:text-base text-text-secondary max-w-xl">
          Gestiona simulaciones y créditos vehiculares de forma rápida y profesional.
        </p>
      </div>

      <a
        routerLink="/simulations"
        class="shrink-0 flex items-center gap-2 bg-accent hover:bg-accent-hover text-background px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-colors shadow-glow focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        Nueva simulación
      </a>
    </div>
  `
})
export class WelcomeBannerComponent {
  userName = input<string>('Alex Aquino');
}
