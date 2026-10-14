
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap, throwError } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = '/api/auth';

  isAuthenticated = signal(false);

  login(credentials: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          console.log('Login response keys:', Object.keys(response));
  console.log(
    'Refresh token property exists:',
    Object.hasOwn(response, 'refreshToken')
  );
  console.log(
    'Refresh token is a string:',
    typeof response.refreshToken === 'string'
  );
          sessionStorage.setItem('accessToken', response.token);
          sessionStorage.setItem('refreshToken', response.refreshToken);

          this.isAuthenticated.set(true);
        })
      );
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  refreshAccessToken() {
  const refreshToken = sessionStorage.getItem('refreshToken');

  if (!refreshToken) {
    return throwError(() => new Error('Refresh token not found'));
  }

  return this.http
    .post<LoginResponse>(`${this.apiUrl}/refresh`, { refreshToken })
    .pipe(
      tap((response) => {
        // Save BOTH rotated tokens.
        sessionStorage.setItem('accessToken', response.token);
        sessionStorage.setItem('refreshToken', response.refreshToken);
      })
    );
}


logout() {
  return this.http
    .post(`${this.apiUrl}/logout`, {})
    .pipe(
      catchError((error) => {
        // Local logout should still work if the server request fails.
        console.error('Backend logout failed:', error);
        return of(null);
      }),
      tap(() => {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        this.isAuthenticated.set(false);
      })
    );
}

isLoggedIn(): boolean {
  return !!this.getAccessToken();
}

}
