import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Contenido, TipoContenido, CategoriaContenido, ContenidoFormData } from '../models/contenido.model';

@Injectable({
  providedIn: 'root'
})
export class ContenidoService {
  // Datos falsos para desarrollo
  private contenidosFalsos: Contenido[] = [
    {
      id: '1',
      nombreArchivo: 'Intro_a_Marketing.mp4',
      titulo: 'Introducción al Marketing',
      descripcion: 'Conceptos básicos de marketing digital para emprendedores',
      tipo: 'video',
      categoria: 'Pre-Incubacion',
      url: '/assets/videos/intro-marketing.mp4',
      tamanio: 125000000, // 125 MB
      fechaCarga: new Date('2023-10-26'),
      fechaActualizacion: new Date('2023-10-26')
    },
    {
      id: '2',
      nombreArchivo: 'Guia_Lean_Canvas.pdf',
      titulo: 'Guía de Lean Canvas',
      descripcion: 'Plantilla y guía completa para crear tu Lean Canvas',
      tipo: 'pdf',
      categoria: 'Pre-Incubacion',
      url: '/assets/pdf/guia-lean-canvas.pdf',
      tamanio: 2500000, // 2.5 MB
      fechaCarga: new Date('2023-10-24'),
      fechaActualizacion: new Date('2023-10-24')
    },
    {
      id: '3',
      nombreArchivo: 'Basicos_Pitch_Deck.mp4',
      titulo: 'Básicos del Pitch Deck',
      descripcion: 'Aprende a crear un pitch deck efectivo para tu startup',
      tipo: 'video',
      categoria: 'Incubadora',
      url: '/assets/videos/basicos-pitch-deck.mp4',
      tamanio: 180000000, // 180 MB
      fechaCarga: new Date('2023-10-22'),
      fechaActualizacion: new Date('2023-10-22')
    },
    {
      id: '4',
      nombreArchivo: 'Plantilla_Proyecciones_Financieras.pdf',
      titulo: 'Plantilla de Proyecciones Financieras',
      descripcion: 'Excel con plantilla para realizar proyecciones financieras',
      tipo: 'pdf',
      categoria: 'Incubadora',
      url: '/assets/pdf/plantilla-proyecciones.pdf',
      tamanio: 1500000, // 1.5 MB
      fechaCarga: new Date('2023-10-20'),
      fechaActualizacion: new Date('2023-10-20')
    },
    {
      id: '5',
      nombreArchivo: 'Validacion_Mercado.mp4',
      titulo: 'Validación de Mercado',
      descripcion: 'Cómo validar tu idea de negocio antes de lanzar',
      tipo: 'video',
      categoria: 'Pre-Incubacion',
      url: '/assets/videos/validacion-mercado.mp4',
      tamanio: 95000000, // 95 MB
      fechaCarga: new Date('2023-10-18'),
      fechaActualizacion: new Date('2023-10-18')
    }
  ];

  constructor() { }

  /**
   * Obtiene todos los contenidos
   * TODO: Reemplazar con llamada HTTP real
   * @returns Observable con la lista de contenidos
   */
  obtenerContenidos(): Observable<Contenido[]> {
    return of([...this.contenidosFalsos]).pipe(delay(500));
  }

  /**
   * Obtiene contenidos filtrados por tipo
   * TODO: Reemplazar con llamada HTTP real
   * @param tipo Tipo de contenido (video, pdf, o null para todos)
   * @returns Observable con la lista de contenidos filtrados
   */
  obtenerContenidosPorTipo(tipo: TipoContenido | null): Observable<Contenido[]> {
    let contenidos = [...this.contenidosFalsos];
    if (tipo) {
      contenidos = contenidos.filter(c => c.tipo === tipo);
    }
    return of(contenidos).pipe(delay(300));
  }

  /**
   * Sube un nuevo contenido
   * 
   * ⚠️ ACTUALMENTE ES SIMULACIÓN: Los archivos NO se guardan realmente.
   * Solo se guarda la información del archivo (nombre, tamaño, etc.) en memoria.
   * Los datos se pierden al recargar la página.
   * 
   * TODO: Reemplazar con llamada HTTP real (FormData) cuando el backend esté listo.
   * El backend debe recibir el archivo y guardarlo en el servidor (disco, S3, etc.)
   * 
   * @param formData Datos del formulario con el archivo
   * @returns Observable con el contenido creado
   */
  subirContenido(formData: ContenidoFormData): Observable<Contenido> {
    if (!formData.archivo) {
      throw new Error('El archivo es requerido');
    }

    // Validar tamaño (máx. 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB en bytes
    if (formData.archivo.size > maxSize) {
      throw new Error('El archivo excede el tamaño máximo de 500MB');
    }

    // Determinar tipo de contenido
    const tipo: TipoContenido = formData.archivo.type.startsWith('video/') ? 'video' : 'pdf';

    // ⚠️ SIMULACIÓN: Solo crea un objeto en memoria, NO guarda el archivo real
    // El archivo físico nunca se almacena, solo sus metadatos
    const nuevoContenido: Contenido = {
      id: `cont_${Date.now()}`,
      nombreArchivo: formData.archivo.name,
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      tipo,
      categoria: formData.categoria,
      url: `/assets/${tipo}s/${formData.archivo.name}`, // URL simulada
      tamanio: formData.archivo.size,
      fechaCarga: new Date(),
      fechaActualizacion: new Date()
    };

    // Agregar solo a memoria (se pierde al recargar)
    this.contenidosFalsos.unshift(nuevoContenido);
    return of(nuevoContenido).pipe(delay(1000));
  }

  /**
   * Actualiza un contenido existente
   * TODO: Reemplazar con llamada HTTP real
   * @param id ID del contenido
   * @param datos Datos actualizados
   * @returns Observable con el contenido actualizado
   */
  actualizarContenido(id: string, datos: Partial<Contenido>): Observable<Contenido> {
    const contenido = this.contenidosFalsos.find(c => c.id === id);
    if (!contenido) {
      throw new Error('Contenido no encontrado');
    }

    Object.assign(contenido, datos);
    contenido.fechaActualizacion = new Date();

    return of(contenido).pipe(delay(800));
  }

  /**
   * Elimina un contenido
   * TODO: Reemplazar con llamada HTTP real
   * @param id ID del contenido
   * @returns Observable con el resultado
   */
  eliminarContenido(id: string): Observable<boolean> {
    const index = this.contenidosFalsos.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Contenido no encontrado');
    }

    this.contenidosFalsos.splice(index, 1);
    return of(true).pipe(delay(600));
  }

  /**
   * Obtiene un contenido por ID
   * TODO: Reemplazar con llamada HTTP real
   * @param id ID del contenido
   * @returns Observable con el contenido
   */
  obtenerContenidoPorId(id: string): Observable<Contenido | null> {
    const contenido = this.contenidosFalsos.find(c => c.id === id);
    return of(contenido || null).pipe(delay(300));
  }

  // ========== MÉTODOS PREPARADOS PARA CONSUMIR ENDPOINTS REALES ==========
  
  /**
   * INSTRUCCIONES PARA IMPLEMENTAR EL GUARDADO REAL DE ARCHIVOS:
   * 
   * 1. El backend debe tener un endpoint POST que reciba FormData con el archivo
   * 2. El backend debe guardar el archivo en:
   *    - Disco del servidor (carpeta uploads/)
   *    - Servicio de almacenamiento (AWS S3, Google Cloud Storage, etc.)
   *    - Base de datos (para archivos pequeños)
   * 3. El backend debe devolver la URL donde quedó guardado el archivo
   * 
   * PASOS PARA ACTIVAR:
   * 
   * 1. Importar HttpClient en el constructor:
   *    constructor(private http: HttpClient) {}
   * 
   * 2. Definir la URL del API:
   *    private apiUrl = 'http://localhost:3000/api'; // Cambiar según tu backend
   * 
   * 3. Reemplazar el método subirContenido() con este código:
   * 
   * subirContenido(formData: ContenidoFormData): Observable<Contenido> {
   *   if (!formData.archivo) {
   *     throw new Error('El archivo es requerido');
   *   }
   * 
   *   // Validar tamaño (máx. 500MB)
   *   const maxSize = 500 * 1024 * 1024;
   *   if (formData.archivo.size > maxSize) {
   *     throw new Error('El archivo excede el tamaño máximo de 500MB');
   *   }
   * 
   *   // Crear FormData para enviar el archivo
   *   const formDataToSend = new FormData();
   *   formDataToSend.append('archivo', formData.archivo);
   *   formDataToSend.append('titulo', formData.titulo);
   *   formDataToSend.append('descripcion', formData.descripcion);
   *   formDataToSend.append('categoria', formData.categoria);
   *   
   *   // El backend guardará el archivo y devolverá la información completa
   *   return this.http.post<Contenido>(`${this.apiUrl}/contenidos`, formDataToSend);
   * }
   * 
   * 4. Reemplazar los demás métodos con llamadas HTTP reales:
   * 
   * obtenerContenidos(): Observable<Contenido[]> {
   *   return this.http.get<Contenido[]>(`${this.apiUrl}/contenidos`);
   * }
   * 
   * obtenerContenidosPorTipo(tipo: TipoContenido | null): Observable<Contenido[]> {
   *   const url = tipo 
   *     ? `${this.apiUrl}/contenidos?tipo=${tipo}`
   *     : `${this.apiUrl}/contenidos`;
   *   return this.http.get<Contenido[]>(url);
   * }
   * 
   * actualizarContenido(id: string, datos: Partial<Contenido>): Observable<Contenido> {
   *   return this.http.put<Contenido>(`${this.apiUrl}/contenidos/${id}`, datos);
   * }
   * 
   * eliminarContenido(id: string): Observable<boolean> {
   *   // El backend también debe eliminar el archivo físico del servidor
   *   return this.http.delete<boolean>(`${this.apiUrl}/contenidos/${id}`);
   * }
   * 
   * obtenerContenidoPorId(id: string): Observable<Contenido> {
   *   return this.http.get<Contenido>(`${this.apiUrl}/contenidos/${id}`);
   * }
   * 
   * NOTA: Asegúrate de que el backend tenga configurado CORS para aceptar
   * peticiones desde tu aplicación Angular.
   */
}

