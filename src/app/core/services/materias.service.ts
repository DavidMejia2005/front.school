import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config';
import { ApiResponse } from '../models/api-response.model';
import { Materia } from '../models/materia.model';

@Injectable({ providedIn: 'root' })
export class MateriasService {
  private readonly base = `${API_BASE_URL}/materias`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Materia[]>> {
    return this.http.get<ApiResponse<Materia[]>>(this.base);
  }

  getOne(id: number): Observable<ApiResponse<Materia>> {
    return this.http.get<ApiResponse<Materia>>(`${this.base}/${id}`);
  }

  create(data: Partial<Materia>): Observable<ApiResponse<Materia>> {
    return this.http.post<ApiResponse<Materia>>(this.base, data);
  }

  update(id: number, data: Partial<Materia>): Observable<ApiResponse<Materia>> {
    return this.http.put<ApiResponse<Materia>>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}
