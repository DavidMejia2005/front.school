import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config';
import { ApiResponse } from '../models/api-response.model';
import { Nota, NotaFiltros } from '../models/nota.model';

@Injectable({ providedIn: 'root' })
export class NotasService {
  private readonly base = `${API_BASE_URL}/notas`;

  constructor(private http: HttpClient) {}

  getAll(filtros: NotaFiltros = {}): Observable<ApiResponse<Nota[]>> {
    let params = new HttpParams();
    if (filtros.estudiante_id) params = params.set('estudiante_id', String(filtros.estudiante_id));
    if (filtros.materia_id) params = params.set('materia_id', String(filtros.materia_id));
    if (filtros.periodo) params = params.set('periodo', String(filtros.periodo));
    if (filtros.año_lectivo) params = params.set('año_lectivo', String(filtros.año_lectivo));
    return this.http.get<ApiResponse<Nota[]>>(this.base, { params });
  }

  getOne(id: number): Observable<ApiResponse<Nota>> {
    return this.http.get<ApiResponse<Nota>>(`${this.base}/${id}`);
  }

  create(data: Partial<Nota>): Observable<ApiResponse<Nota>> {
    return this.http.post<ApiResponse<Nota>>(this.base, data);
  }

  update(id: number, data: Partial<Nota>): Observable<ApiResponse<Nota>> {
    return this.http.put<ApiResponse<Nota>>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}
