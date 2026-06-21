import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config';
import { ApiResponse } from '../models/api-response.model';
import { Profesor, ProfesorFiltros } from '../models/profesor.model';

@Injectable({ providedIn: 'root' })
export class ProfesoresService {
  private readonly base = `${API_BASE_URL}/profesores`;

  constructor(private http: HttpClient) {}

  getAll(filtros: ProfesorFiltros = {}): Observable<ApiResponse<Profesor[]>> {
    let params = new HttpParams();
    if (filtros.buscar) params = params.set('buscar', filtros.buscar);
    if (filtros.activo !== undefined) params = params.set('activo', String(filtros.activo));
    return this.http.get<ApiResponse<Profesor[]>>(this.base, { params });
  }

  getOne(id: number): Observable<ApiResponse<Profesor>> {
    return this.http.get<ApiResponse<Profesor>>(`${this.base}/${id}`);
  }

  create(data: Partial<Profesor>): Observable<ApiResponse<Profesor>> {
    return this.http.post<ApiResponse<Profesor>>(this.base, data);
  }

  update(id: number, data: Partial<Profesor>): Observable<ApiResponse<Profesor>> {
    return this.http.put<ApiResponse<Profesor>>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}
