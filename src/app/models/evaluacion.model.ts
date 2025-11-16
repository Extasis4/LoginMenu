export interface PreguntaEvaluacion {
  id: string;
  titulo: string;
  subtitulo: string;
  instrucciones: string;
  pregunta: string;
  tiempoLimiteGrabacion?: number; // en segundos
}

export interface RespuestaEvaluacion {
  preguntaId: string;
  respuestaTexto: string;
  duracionGrabacion?: number; // en segundos
  fechaRespuesta: Date;
  metodoRespuesta: 'texto' | 'voz' | 'mixto';
}

