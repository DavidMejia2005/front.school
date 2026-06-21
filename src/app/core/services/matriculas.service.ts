import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config';
import { ApiResponse } from '../models/api-response.model';
import { EstadoMatricula, Matricula, MatriculaFiltros } from '../models/matricula.model';

@Injectable({ providedIn: 'root' })
export class MatriculasService {
  private readonly base = `${API_BASE_URL}/matriculas`;

  constructor(private http: HttpClient) {}

  getAll(filtros: MatriculaFiltros = {}): Observable<ApiResponse<Matricula[]>> {
    let params = new HttpParams();
    if (filtros.año_lectivo) params = params.set('año_lectivo', String(filtros.año_lectivo));
    if (filtros.grado_id) params = params.set('grado_id', String(filtros.grado_id));
    if (filtros.estado) params = params.set('estado', filtros.estado);
    return this.http.get<ApiResponse<Matricula[]>>(this.base, { params });
  }

  getOne(id: number): Observable<ApiResponse<Matricula>> {
    return this.http.get<ApiResponse<Matricula>>(`${this.base}/${id}`);
  }

  create(data: Partial<Matricula>): Observable<ApiResponse<Matricula>> {
    return this.http.post<ApiResponse<Matricula>>(this.base, data);
  }

  update(id: number, data: Partial<Matricula>): Observable<ApiResponse<Matricula>> {
    return this.http.put<ApiResponse<Matricula>>(`${this.base}/${id}`, data);
  }

  updateEstado(id: number, estado: EstadoMatricula): Observable<ApiResponse<Matricula>> {
    return this.http.patch<ApiResponse<Matricula>>(`${this.base}/${id}/estado`, { estado });
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}
