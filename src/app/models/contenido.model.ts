export type TipoContenido = 'video' | 'pdf';
export type CategoriaContenido = 'Pre-Incubacion' | 'Incubadora';

export interface Contenido {
  id: string;
  nombreArchivo: string;
  titulo: string;
  descripcion: string;
  tipo: TipoContenido;
  categoria: CategoriaContenido;
  url: string;
  tamanio: number; // en bytes
  fechaCarga: Date;
  fechaActualizacion?: Date;
}

export interface ContenidoFormData {
  archivo: File | null;
  titulo: string;
  descripcion: string;
  categoria: CategoriaContenido;
}

