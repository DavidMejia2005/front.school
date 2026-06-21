import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config';
import { ApiResponse } from '../models/api-response.model';
import { Grado } from '../models/grado.model';

@Injectable({ providedIn: 'root' })
export class GradosService {
  private readonly base = `${API_BASE_URL}/grados`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Grado[]>> {
    return this.http.get<ApiResponse<Grado[]>>(this.base);
  }

  getOne(id: number): Observable<ApiResponse<Grado>> {
    return this.http.get<ApiResponse<Grado>>(`${this.base}/${id}`);
  }

  create(data: Partial<Grado>): Observable<ApiResponse<Grado>> {
    return this.http.post<ApiResponse<Grado>>(this.base, data);
  }

  update(id: number, data: Partial<Grado>): Observable<ApiResponse<Grado>> {
    return this.http.put<ApiResponse<Grado>>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}
