import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config';
import { ApiResponse } from '../models/api-response.model';
import { Estudiante, EstudianteFiltros } from '../models/estudiante.model';

@Injectable({ providedIn: 'root' })
export class EstudiantesService {
  private readonly base = `${API_BASE_URL}/estudiantes`;

  constructor(private http: HttpClient) {}

  getAll(filtros: EstudianteFiltros = {}): Observable<ApiResponse<Estudiante[]>> {
    let params = new HttpParams();
    if (filtros.buscar) params = params.set('buscar', filtros.buscar);
    if (filtros.grado_id) params = params.set('grado_id', String(filtros.grado_id));
    if (filtros.activo !== undefined) params = params.set('activo', String(filtros.activo));
    return this.http.get<ApiResponse<Estudiante[]>>(this.base, { params });
  }

  getOne(id: number): Observable<ApiResponse<Estudiante>> {
    return this.http.get<ApiResponse<Estudiante>>(`${this.base}/${id}`);
  }

  create(data: Partial<Estudiante>): Observable<ApiResponse<Estudiante>> {
    return this.http.post<ApiResponse<Estudiante>>(this.base, data);
  }

  update(id: number, data: Partial<Estudiante>): Observable<ApiResponse<Estudiante>> {
    return this.http.put<ApiResponse<Estudiante>>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}
