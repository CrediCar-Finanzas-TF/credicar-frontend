import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../../../shared/ui/logo/logo.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LogoComponent],
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent {
  private router = inject(Router);

  get isLogin(): boolean {
    return this.router.url.includes('login') || this.router.url === '/';
  }
}
