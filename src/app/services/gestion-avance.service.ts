import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map } from 'rxjs';
import { Usuario, Tema, Certificacion } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class GestionAvanceService {
  private readonly CERTIFICATIONS_API = 'https://api.childfound.online/api/certifications';
  // Datos falsos para desarrollo
  private usuariosFalsos: Usuario[] = [
    {
      id: '1',
      nombre: 'Juan Pérez',
      email: 'juan.perez@example.com',
      fechaRegistro: new Date('2024-01-15'),
      certificadosObtenidos: 2,
      temas: [
        {
          id: 't1',
          nombre: 'Fundamentos de Emprendimiento',
          categoria: 'Pre-Incubacion',
          aprendido: true,
          fechaAprendizaje: new Date('2024-02-01'),
          requiereMentoria: true,
          mentoriasCompletadas: 2,
          mentoriasRequeridas: 2
        },
        {
          id: 't2',
          nombre: 'Modelo de Negocio',
          categoria: 'Pre-Incubacion',
          aprendido: true,
          fechaAprendizaje: new Date('2024-02-15'),
          requiereMentoria: true,
          mentoriasCompletadas: 1,
          mentoriasRequeridas: 2
        },
        {
          id: 't3',
          nombre: 'Validación de Mercado',
          categoria: 'Incubadora',
          aprendido: false,
          requiereMentoria: true,
          mentoriasCompletadas: 0,
          mentoriasRequeridas: 3
        }
      ]
    },
    {
      id: '2',
      nombre: 'María González',
      email: 'maria.gonzalez@example.com',
      fechaRegistro: new Date('2024-01-20'),
      certificadosObtenidos: 1,
      temas: [
        {
          id: 't1',
          nombre: 'Fundamentos de Emprendimiento',
          categoria: 'Pre-Incubacion',
          aprendido: true,
          fechaAprendizaje: new Date('2024-02-05'),
          requiereMentoria: true,
          mentoriasCompletadas: 2,
          mentoriasRequeridas: 2
        },
        {
          id: 't4',
          nombre: 'Finanzas para Startups',
          categoria: 'Pre-Incubacion',
          aprendido: true,
          fechaAprendizaje: new Date('2024-02-20'),
          requiereMentoria: true,
          mentoriasCompletadas: 0,
          mentoriasRequeridas: 2
        }
      ]
    },
    {
      id: '3',
      nombre: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@example.com',
      fechaRegistro: new Date('2024-02-01'),
      certificadosObtenidos: 0,
      temas: [
        {
          id: 't1',
          nombre: 'Fundamentos de Emprendimiento',
          categoria: 'Pre-Incubacion',
          aprendido: true,
          fechaAprendizaje: new Date('2024-02-10'),
          requiereMentoria: true,
          mentoriasCompletadas: 1,
          mentoriasRequeridas: 2
        },
        {
          id: 't5',
          nombre: 'Marketing Digital',
          categoria: 'Incubadora',
          aprendido: false,
          requiereMentoria: true,
          mentoriasCompletadas: 0,
          mentoriasRequeridas: 3
        }
      ]
    }
  ];

  private certificacionesFalsas: Certificacion[] = [
    {
      id: 'c1',
      usuarioId: '1',
      usuarioNombre: 'Juan Pérez',
      temaId: 't1',
      temaNombre: 'Fundamentos de Emprendimiento',
      estado: 'completada',
      fechaSolicitud: new Date('2024-02-01'),
      fechaCompletada: new Date('2024-02-15')
    },
    {
      id: 'c2',
      usuarioId: '1',
      usuarioNombre: 'Juan Pérez',
      temaId: 't2',
      temaNombre: 'Modelo de Negocio',
      estado: 'en_mentoria',
      fechaSolicitud: new Date('2024-02-15')
    },
    {
      id: 'c3',
      usuarioId: '2',
      usuarioNombre: 'María González',
      temaId: 't1',
      temaNombre: 'Fundamentos de Emprendimiento',
      estado: 'completada',
      fechaSolicitud: new Date('2024-02-05'),
      fechaCompletada: new Date('2024-02-18')
    },
    {
      id: 'c4',
      usuarioId: '2',
      usuarioNombre: 'María González',
      temaId: 't4',
      temaNombre: 'Finanzas para Startups',
      estado: 'pendiente',
      fechaSolicitud: new Date('2024-02-20')
    },
    {
      id: 'c5',
      usuarioId: '3',
      usuarioNombre: 'Carlos Rodríguez',
      temaId: 't1',
      temaNombre: 'Fundamentos de Emprendimiento',
      estado: 'en_mentoria',
      fechaSolicitud: new Date('2024-02-10')
    }
  ];

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de usuarios con sus temas y estado de aprendizaje
   * TODO: Reemplazar con llamada HTTP real
   * @returns Observable con la lista de usuarios
   */
  obtenerUsuarios(): Observable<Usuario[]> {
    // Simular delay de red
    return of([...this.usuariosFalsos]).pipe(delay(500));
  }

  /**
   * Obtiene un usuario por su ID
   * TODO: Reemplazar con llamada HTTP real
   * @param usuarioId ID del usuario
   * @returns Observable con el usuario
   */
  obtenerUsuarioPorId(usuarioId: string): Observable<Usuario | null> {
    const usuario = this.usuariosFalsos.find(u => u.id === usuarioId);
    return of(usuario || null).pipe(delay(300));
  }

  /**
   * Obtiene las certificaciones pendientes y en proceso
   * TODO: Reemplazar con llamada HTTP real
   * @returns Observable con la lista de certificaciones
   */
  obtenerCertificaciones(): Observable<Certificacion[]> {
    // Consumir API real y mapear al modelo del front
    return this.http.get<any[]>(this.CERTIFICATIONS_API).pipe(
      map(items => (items || []).map((it): Certificacion => ({
        id: it.id,
        usuarioId: it.userId,
        usuarioNombre: it.user?.name ?? it.userId,
        temaId: it.topicId,
        temaNombre: it.topic?.name ?? it.topicId,
        // Mapear estados backend -> frontend
        estado: it.status === 'completed' ? 'completada'
              : it.status === 'in_progress' ? 'en_mentoria'
              : 'pendiente',
        backendStatus: it.status,
        progressPercentage: it.progressPercentage,
        urlImage: it.urlImage ?? null,
        // La API no trae fechas; usamos placeholders seguros
        fechaSolicitud: new Date(),
        fechaCompletada: it.status === 'completed' ? new Date() : undefined,
        // Observaciones no provistas por la API
        observaciones: undefined
      })))
    );
  }

  /**
   * Marca una certificación como completada (100% y status completed) en el backend
   */
  actualizarCertificacionProgreso(certificacionId: string): Observable<any> {
    const url = `${this.CERTIFICATIONS_API}/${encodeURIComponent(certificacionId)}/progress`;
    const body = {
      progressPercentage: 100,
      status: 'completed'
    };
    return this.http.patch(url, body);
  }

  /**
   * Minta el certificado (usa DEFAULT_MINT_TO en el backend)
   */
  mintSimple(name: string, topic: string): Observable<any> {
    const url = `${this.CERTIFICATIONS_API}/certificate/mint-simple`;
    const body = { name, topic };
    return this.http.post(url, body);
  }

  /**
   * Confirma que un usuario aprendió un tema mediante mentoría
   * TODO: Reemplazar con llamada HTTP real
   * @param usuarioId ID del usuario
   * @param temaId ID del tema
   * @param observaciones Observaciones del admin
   * @returns Observable con la certificación actualizada
   */
  confirmarAprendizaje(
    usuarioId: string,
    temaId: string,
    observaciones?: string
  ): Observable<Certificacion> {
    // Simular actualización
    const certificacion = this.certificacionesFalsas.find(
      c => c.usuarioId === usuarioId && c.temaId === temaId
    );

    if (certificacion) {
      certificacion.estado = 'completada';
      certificacion.fechaCompletada = new Date();
      certificacion.observaciones = observaciones;
      
      // Actualizar el usuario
      const usuario = this.usuariosFalsos.find(u => u.id === usuarioId);
      if (usuario) {
        usuario.certificadosObtenidos++;
        const tema = usuario.temas.find(t => t.id === temaId);
        if (tema) {
          tema.mentoriasCompletadas = tema.mentoriasRequeridas;
        }
      }
    } else {
      // Crear nueva certificación
      const usuario = this.usuariosFalsos.find(u => u.id === usuarioId);
      const tema = usuario?.temas.find(t => t.id === temaId);
      
      if (usuario && tema) {
        const nuevaCertificacion: Certificacion = {
          id: `c${Date.now()}`,
          usuarioId,
          usuarioNombre: usuario.nombre,
          temaId,
          temaNombre: tema.nombre,
          estado: 'completada',
          fechaSolicitud: new Date(),
          fechaCompletada: new Date(),
          observaciones
        };
        this.certificacionesFalsas.push(nuevaCertificacion);
        usuario.certificadosObtenidos++;
        tema.mentoriasCompletadas = tema.mentoriasRequeridas;
      }
    }

    const certificacionActualizada = this.certificacionesFalsas.find(
      c => c.usuarioId === usuarioId && c.temaId === temaId
    )!;

    return of(certificacionActualizada).pipe(delay(800));
  }

  /**
   * Inicia el proceso de mentoría para un tema
   * TODO: Reemplazar con llamada HTTP real
   * @param usuarioId ID del usuario
   * @param temaId ID del tema
   * @returns Observable con la certificación actualizada
   */
  iniciarMentoria(usuarioId: string, temaId: string): Observable<Certificacion> {
    let certificacion = this.certificacionesFalsas.find(
      c => c.usuarioId === usuarioId && c.temaId === temaId
    );

    if (!certificacion) {
      const usuario = this.usuariosFalsos.find(u => u.id === usuarioId);
      const tema = usuario?.temas.find(t => t.id === temaId);
      
      if (usuario && tema) {
        certificacion = {
          id: `c${Date.now()}`,
          usuarioId,
          usuarioNombre: usuario.nombre,
          temaId,
          temaNombre: tema.nombre,
          estado: 'en_mentoria',
          fechaSolicitud: new Date()
        };
        this.certificacionesFalsas.push(certificacion);
      }
    } else {
      certificacion.estado = 'en_mentoria';
    }

    return of(certificacion!).pipe(delay(600));
  }

  /**
   * Rechaza una certificación
   * TODO: Reemplazar con llamada HTTP real
   * @param certificacionId ID de la certificación
   * @param motivo Motivo del rechazo
   * @returns Observable con la certificación actualizada
   */
  rechazarCertificacion(certificacionId: string, motivo: string): Observable<Certificacion> {
    const certificacion = this.certificacionesFalsas.find(c => c.id === certificacionId);
    if (certificacion) {
      certificacion.estado = 'rechazada';
      certificacion.observaciones = motivo;
    }
    return of(certificacion!).pipe(delay(600));
  }

  // ========== MÉTODOS PREPARADOS PARA CONSUMIR ENDPOINTS REALES ==========
  
  /**
   * Método preparado para consumir el endpoint real
   * Descomentar y configurar cuando el backend esté listo
   * 
   * Ejemplo de uso:
   * 
   * import { HttpClient } from '@angular/common/http';
   * 
   * constructor(private http: HttpClient) {}
   * 
   * obtenerUsuarios(): Observable<Usuario[]> {
   *   return this.http.get<Usuario[]>('/api/usuarios');
   * }
   */
  
  // private apiUrl = 'http://localhost:3000/api'; // Configurar según tu backend
  // 
  // obtenerUsuarios(): Observable<Usuario[]> {
  //   return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  // }
  // 
  // obtenerUsuarioPorId(usuarioId: string): Observable<Usuario> {
  //   return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${usuarioId}`);
  // }
  // 
  // obtenerCertificaciones(): Observable<Certificacion[]> {
  //   return this.http.get<Certificacion[]>(`${this.apiUrl}/certificaciones`);
  // }
  // 
  // confirmarAprendizaje(usuarioId: string, temaId: string, observaciones?: string): Observable<Certificacion> {
  //   return this.http.post<Certificacion>(`${this.apiUrl}/certificaciones/confirmar`, {
  //     usuarioId,
  //     temaId,
  //     observaciones
  //   });
  // }
  // 
  // iniciarMentoria(usuarioId: string, temaId: string): Observable<Certificacion> {
  //   return this.http.post<Certificacion>(`${this.apiUrl}/certificaciones/iniciar-mentoria`, {
  //     usuarioId,
  //     temaId
  //   });
  // }
  // 
  // rechazarCertificacion(certificacionId: string, motivo: string): Observable<Certificacion> {
  //   return this.http.put<Certificacion>(`${this.apiUrl}/certificaciones/${certificacionId}/rechazar`, {
  //     motivo
  //   });
  // }
}

