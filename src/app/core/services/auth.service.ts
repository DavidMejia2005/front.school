import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_BASE_URL, TOKEN_KEY, USER_KEY } from '../config';
import { ApiResponse } from '../models/api-response.model';
import { LoginResponseData, Usuario } from '../models/usuario.model';

// Matriz de permisos por rol (idéntica a la del frontend original).
const PERMISSIONS: Record<string, string[]> = {
  create_estudiante: ['admin', 'secretaria'],
  edit_estudiante: ['admin', 'secretaria'],
  delete_estudiante: ['admin'],

  create_profesor: ['admin'],
  edit_profesor: ['admin'],
  delete_profesor: ['admin'],

  create_materia: ['admin', 'secretaria'],
  edit_materia: ['admin', 'secretaria'],
  delete_materia: ['admin'],

  create_grado: ['admin', 'secretaria'],
  edit_grado: ['admin', 'secretaria'],
  delete_grado: ['admin'],

  register_nota: ['admin', 'secretaria', 'docente'],
  edit_nota: ['admin', 'secretaria', 'docente'],
  delete_nota: ['admin'],

  create_matricula: ['admin', 'secretaria'],
  edit_matricula: ['admin', 'secretaria'],
  delete_matricula: ['admin'],
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<Usuario | null>(this.getUserFromStorage());
  /** Observable del usuario autenticado actual (o null). Útil para navbar/sidebar. */
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<ApiResponse<LoginResponseData>> {
    return this.http
      .post<ApiResponse<LoginResponseData>>(`${API_BASE_URL}/auth/login`, { username, password })
      .pipe(
        tap((res) => {
          if (res.success && res.datos) {
            this.setAuth(res.datos.token, res.datos.usuario);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /** Equivalente a canPerform() en auth.js */
  canPerform(action: string): boolean {
    const user = this.getUser();
    if (!user) return false;
    const allowed = PERMISSIONS[action];
    return !!allowed && allowed.includes(user.rol);
  }

  private setAuth(token: string, user: Usuario): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getUserFromStorage(): Usuario | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  }
}
