import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Business } from '../models';
import { getApiUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private businessesSubject = new BehaviorSubject<Business[]>([]);
  public businesses$ = this.businessesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Obtener todos los negocios
  getBusinesses(): Observable<Business[]> {
    return this.http.get<Business[]>(getApiUrl('/businesses'))
      .pipe(
        tap(businesses => this.businessesSubject.next(businesses))
      );
  }

  // Obtener negocio por ID
  getBusinessById(id: string): Observable<Business> {
    return this.http.get<Business>(getApiUrl(`/businesses/${id}`));
  }

  // Obtener negocios por usuario
  getBusinessesByUser(userId: string): Observable<Business[]> {
    return this.http.get<Business[]>(getApiUrl(`/businesses/user/${userId}`));
  }

  // Obtener negocios por rubro
  getBusinessesByRubro(rubroId: string): Observable<Business[]> {
    return this.http.get<Business[]>(getApiUrl(`/businesses/rubro/${rubroId}`));
  }

  // Obtener negocios por estado
  getBusinessesByStatus(status: string): Observable<Business[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<Business[]>(getApiUrl('/businesses'), { params });
  }

  // Crear nuevo negocio
  createBusiness(business: Partial<Business>): Observable<Business> {
    return this.http.post<Business>(getApiUrl('/businesses'), business)
      .pipe(
        tap(() => this.refreshBusinesses())
      );
  }

  // Actualizar negocio
  updateBusiness(id: string, business: Partial<Business>): Observable<Business> {
    return this.http.put<Business>(getApiUrl(`/businesses/${id}`), business)
      .pipe(
        tap(() => this.refreshBusinesses())
      );
  }

  // Actualizar estado del negocio
  updateBusinessStatus(id: string, status: Business['status']): Observable<Business> {
    return this.http.patch<Business>(getApiUrl(`/businesses/${id}/status`), { status })
      .pipe(
        tap(() => this.refreshBusinesses())
      );
  }

  // Finalizar negocio
  finalizeBusiness(id: string, isSuccessful: boolean): Observable<Business> {
    return this.http.patch<Business>(getApiUrl(`/businesses/${id}/finalize`), { 
      isSuccessful,
      finalizedAt: new Date().toISOString()
    }).pipe(
      tap(() => this.refreshBusinesses())
    );
  }

  // Eliminar negocio
  deleteBusiness(id: string): Observable<void> {
    return this.http.delete<void>(getApiUrl(`/businesses/${id}`))
      .pipe(
        tap(() => this.refreshBusinesses())
      );
  }

  // Obtener estadísticas de negocios
  getBusinessStats(): Observable<any> {
    return this.http.get(getApiUrl('/businesses/stats'));
  }

  // Refrescar la lista de negocios
  private refreshBusinesses(): void {
    this.getBusinesses().subscribe();
  }

  // Limpiar el estado
  clearBusinesses(): void {
    this.businessesSubject.next([]);
  }
}