export interface Tema {
  id: string;
  nombre: string;
  categoria: 'Pre-Incubacion' | 'Incubadora';
  aprendido: boolean;
  fechaAprendizaje?: Date;
  requiereMentoria: boolean;
  mentoriasCompletadas: number;
  mentoriasRequeridas: number;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  temas: Tema[];
  certificadosObtenidos: number;
  fechaRegistro: Date;
}

export interface Certificacion {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  temaId: string;
  temaNombre: string;
  estado: 'pendiente' | 'en_mentoria' | 'completada' | 'rechazada';
  fechaSolicitud: Date;
  fechaCompletada?: Date;
  observaciones?: string;
  backendStatus?: 'pending' | 'in_progress' | 'completed';
  progressPercentage?: number;
  urlImage?: string | null;
  contractAddress?: string;
  tokenId?: string;
  txHash?: string;
}

