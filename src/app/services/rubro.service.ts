import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models';
import { getApiUrl } from '../config/api.config';

export interface Rubro {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class RubroService {

  constructor(private http: HttpClient) {}

  // Obtener todos los rubros
  getRubros(): Observable<Rubro[]> {
    return this.http.get<Rubro[]>(getApiUrl('/rubros'));
  }

  // Obtener rubro por ID
  getRubroById(id: string): Observable<Rubro> {
    return this.http.get<Rubro>(getApiUrl(`/rubros/${id}`));
  }

  // Obtener usuarios de un rubro específico
  getUsersByRubro(rubroId: string): Observable<User[]> {
    return this.http.get<User[]>(getApiUrl(`/rubros/${rubroId}/users`));
  }

  // Crear nuevo rubro
  createRubro(rubro: Partial<Rubro>): Observable<Rubro> {
    return this.http.post<Rubro>(getApiUrl('/rubros'), rubro);
  }

  // Actualizar rubro
  updateRubro(id: string, rubro: Partial<Rubro>): Observable<Rubro> {
    return this.http.put<Rubro>(getApiUrl(`/rubros/${id}`), rubro);
  }

  // Eliminar rubro
  deleteRubro(id: string): Observable<void> {
    return this.http.delete<void>(getApiUrl(`/rubros/${id}`));
  }
}