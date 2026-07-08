import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

const PUBLIC_URL_FRAGMENTS = ['/authentication/sign-in', '/authentication/sign-up'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  const isPublicEndpoint = PUBLIC_URL_FRAGMENTS.some(fragment => req.url.includes(fragment));

  if (!token || isPublicEndpoint) {
    return next(req);
  }

  return next(req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }));
};
