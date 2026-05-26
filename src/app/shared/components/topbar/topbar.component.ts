import { Component, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  template: `
    <header class="h-16 w-full border-b border-border-base/30 flex items-center justify-end px-8 bg-background/50 backdrop-blur-md sticky top-0 z-40">

      <div class="flex items-center gap-2">
        <button
          (click)="toggleTheme()"
          class="relative p-2 text-text-secondary hover:text-text-primary transition-colors focus:outline-none rounded-none"
          title="Cambiar tema"
        >
          @if (isDarkMode()) {
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-icon lucide-moon"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>
          }
        </button>

        <div class="w-px h-5 bg-border-base/50 mx-1"></div>

        <button class="relative p-2 text-text-secondary hover:text-text-primary transition-colors focus:outline-none rounded-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          <span class="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full"></span>
        </button>
      </div>

    </header>
  `
})
export class TopbarComponent {
  private document = inject(DOCUMENT);
  isDarkMode = signal(true);

  toggleTheme() {
    this.isDarkMode.update(dark => !dark);
    if (this.isDarkMode()) {
      this.document.documentElement.classList.remove('light');
    } else {
      this.document.documentElement.classList.add('light');
    }
  }
}
