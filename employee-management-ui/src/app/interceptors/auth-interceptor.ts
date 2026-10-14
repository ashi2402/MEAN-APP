
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

  const isLoginRequest = req.url.includes('/api/auth/login');
  const isRefreshRequest = req.url.includes('/api/auth/refresh');

  // Login and refresh requests should not carry an old access token.
  const token = isLoginRequest || isRefreshRequest
    ? null
    : authService.getAccessToken();

  const authRequest = token ? addToken(req, token) : req;

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status !== 401 ||
        isRefreshRequest ||
        isLoginRequest
      ) {
        return throwError(() => error);
      }

      if (!refreshRequest$) {
        refreshRequest$ = authService.refreshAccessToken().pipe(
          finalize(() => {
            refreshRequest$ = null;
          }),
          shareReplay(1)
        );
      }

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
