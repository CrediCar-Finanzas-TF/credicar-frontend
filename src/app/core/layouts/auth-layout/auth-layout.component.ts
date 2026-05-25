import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent {
  private router = inject(Router);

  get isLogin(): boolean {
    return this.router.url.includes('login') || this.router.url === '/';
  }
}
