
import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  catchError,
  finalize,
  Observable,
  shareReplay,
  switchMap,
  throwError
} from 'rxjs';

import { AuthService, LoginResponse } from '../services/auth';

let refreshRequest$: Observable<LoginResponse> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  const authRequest = token ? addToken(req, token) : req;

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      const isUnauthorized = error.status === 401;
      const isRefreshRequest = req.url.includes('/api/auth/refresh');
      const isLoginRequest = req.url.includes('/api/auth/login');

      if (!isUnauthorized || isRefreshRequest || isLoginRequest) {
        return throwError(() => error);
      }

      // Start a refresh only if one isn't already running.
      if (!refreshRequest$) {
        refreshRequest$ = authService.refreshAccessToken().pipe(
          finalize(() => {
            refreshRequest$ = null;
          }),
          shareReplay(1)
        );
      }

      // All concurrent 401 requests share the same refresh result.
      return refreshRequest$.pipe(
        switchMap((response) => {
          const retryRequest = addToken(req, response.token);
          return next(retryRequest);
        }),
        catchError((refreshError) => {
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');
          authService.isAuthenticated.set(false);

          return throwError(() => refreshError);
        })
      );
    })
  );
};

function addToken(
  req: HttpRequest<unknown>,
  token: string
): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}
