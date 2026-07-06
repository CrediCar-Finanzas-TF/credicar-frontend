import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, AuthUser, SignInRequest, SignUpRequest } from '../models/auth.model';

const TOKEN_KEY = 'credicar_token';
const USER_KEY = 'credicar_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/authentication`;

  token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  currentUser = signal<AuthUser | null>(this.readStoredUser());

  isAuthenticated = computed(() => !!this.token());

  private readStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  signUp(request: SignUpRequest): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.baseUrl}/sign-up`, request);
  }

  signIn(request: SignInRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/sign-in`, request).pipe(
      tap(response => this.setSession(response))
    );
  }

  signOut(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.token.set(null);
    this.currentUser.set(null);
  }

  private setSession(response: AuthResponse): void {
    const { token, ...user } = response;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.token.set(token);
    this.currentUser.set(user);
  }
}
