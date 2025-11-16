import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User, UserResponse } from '../models';
import { getApiUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios con paginación
  getUsers(page: number = 1, limit: number = 10, search?: string): Observable<UserResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<UserResponse>(getApiUrl('/users'), { params })
      .pipe(
        tap(response => this.usersSubject.next(response.users))
      );
  }

  // Obtener usuario por ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(getApiUrl(`/users/${id}`));
  }

  // Crear nuevo usuario
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(getApiUrl('/users'), user)
      .pipe(
        tap(() => this.refreshUsers())
      );
  }

  // Actualizar usuario
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(getApiUrl(`/users/${id}`), user)
      .pipe(
        tap(() => this.refreshUsers())
      );
  }

  // Eliminar usuario
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(getApiUrl(`/users/${id}`))
      .pipe(
        tap(() => this.refreshUsers())
      );
  }

  // Obtener usuarios por rubro (usando la estructura real de la API)
  getUsersByRubro(rubroId: string): Observable<User[]> {
    return this.http.get<User[]>(getApiUrl(`/rubros/${rubroId}/users`));
  }

  // Obtener usuarios por módulo
  getUsersByModule(moduleId: string): Observable<User[]> {
    return this.http.get<User[]>(getApiUrl(`/users/module/${moduleId}`));
  }

  // Buscar usuarios
  searchUsers(query: string): Observable<User[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<User[]>(getApiUrl('/users/search'), { params });
  }

  // Obtener estadísticas de usuarios
  getUserStats(): Observable<any> {
    return this.http.get(getApiUrl('/users/stats'));
  }

  // Refrescar la lista de usuarios
  private refreshUsers(): void {
    this.getUsers().subscribe();
  }

  // Limpiar el estado
  clearUsers(): void {
    this.usersSubject.next([]);
  }
}