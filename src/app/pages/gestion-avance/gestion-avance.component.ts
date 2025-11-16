import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GestionAvanceService } from '../../services/gestion-avance.service';
import { Usuario, Tema, Certificacion } from '../../models/usuario.model';

@Component({
  selector: 'app-gestion-avance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-avance.component.html',
  styleUrls: ['./gestion-avance.component.css']
})
export class GestionAvanceComponent implements OnInit {
  usuarios: Usuario[] = [];
  certificaciones: Certificacion[] = [];
  certificacionesFiltradas: Certificacion[] = [];
  usuarioSeleccionado: Usuario | null = null;
  certificacionSeleccionada: Certificacion | null = null;
  
  // Estados de carga
  cargandoUsuarios = false;
  cargandoCertificaciones = false;
  procesando = false;
  
  // Filtros
  filtroEstado: 'todos' | 'pendiente' | 'en_mentoria' | 'completada' | 'rechazada' = 'todos';
  filtroBusqueda = '';
  
  // Modal de confirmación
  mostrarModalConfirmacion = false;
  observacionesMentoria = '';
  usuarioConfirmar: { usuarioId: string; usuarioNombre: string; temaId: string; temaNombre: string } | null = null;

  constructor(private gestionAvanceService: GestionAvanceService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargarUsuarios();
    this.cargarCertificaciones();
  }

  cargarUsuarios(): void {
    this.cargandoUsuarios = true;
    this.gestionAvanceService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.cargandoUsuarios = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.cargandoUsuarios = false;
      }
    });
  }

  cargarCertificaciones(): void {
    this.cargandoCertificaciones = true;
    this.gestionAvanceService.obtenerCertificaciones().subscribe({
      next: (certificaciones) => {
        this.certificaciones = certificaciones;
        this.aplicarFiltros();
        this.cargandoCertificaciones = false;
      },
      error: (error) => {
        console.error('Error al cargar certificaciones:', error);
        this.cargandoCertificaciones = false;
      }
    });
  }

  seleccionarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario;
  }

  obtenerTemasAprendidos(usuario: Usuario): Tema[] {
    return usuario.temas.filter(t => t.aprendido);
  }

  obtenerTemasPendientes(usuario: Usuario): Tema[] {
    return usuario.temas.filter(t => !t.aprendido);
  }

  puedeCertificar(tema: Tema): boolean {
    return tema.aprendido && 
           tema.requiereMentoria && 
           tema.mentoriasCompletadas >= tema.mentoriasRequeridas;
  }

  necesitaMentoria(tema: Tema): boolean {
    return tema.aprendido && 
           tema.requiereMentoria && 
           tema.mentoriasCompletadas < tema.mentoriasRequeridas;
  }

  abrirModalConfirmacion(usuario: Usuario, tema: Tema): void {
    this.usuarioConfirmar = {
      usuarioId: usuario.id,
      usuarioNombre: usuario.nombre,
      temaId: tema.id,
      temaNombre: tema.nombre
    };
    this.observacionesMentoria = '';
    this.mostrarModalConfirmacion = true;
  }

  abrirModalDesdeCertificacion(certificacion: Certificacion): void {
    this.usuarioConfirmar = {
      usuarioId: certificacion.usuarioId,
      usuarioNombre: certificacion.usuarioNombre,
      temaId: certificacion.temaId,
      temaNombre: certificacion.temaNombre
    };
    this.observacionesMentoria = certificacion.observaciones || '';
    this.mostrarModalConfirmacion = true;
  }

  cerrarModalConfirmacion(): void {
    this.mostrarModalConfirmacion = false;
    this.usuarioConfirmar = null;
    this.observacionesMentoria = '';
  }

  confirmarAprendizaje(): void {
    if (!this.usuarioConfirmar) return;

    this.procesando = true;
    this.gestionAvanceService.confirmarAprendizaje(
      this.usuarioConfirmar.usuarioId,
      this.usuarioConfirmar.temaId,
      this.observacionesMentoria
    ).subscribe({
      next: (certificacion) => {
        console.log('Aprendizaje confirmado:', certificacion);
        this.cerrarModalConfirmacion();
        this.cargarDatos(); // Recargar datos
        this.procesando = false;
      },
      error: (error) => {
        console.error('Error al confirmar aprendizaje:', error);
        this.procesando = false;
      }
    });
  }

  iniciarMentoria(usuario: Usuario, tema: Tema): void {
    this.procesando = true;
    this.gestionAvanceService.iniciarMentoria(usuario.id, tema.id).subscribe({
      next: (certificacion) => {
        console.log('Mentoría iniciada:', certificacion);
        this.cargarDatos(); // Recargar datos
        this.procesando = false;
      },
      error: (error) => {
        console.error('Error al iniciar mentoría:', error);
        this.procesando = false;
      }
    });
  }

  aplicarFiltros(): void {
    let filtradas = [...this.certificaciones];

    // Filtro por estado
    if (this.filtroEstado !== 'todos') {
      filtradas = filtradas.filter(c => c.estado === this.filtroEstado);
    }

    // Filtro por búsqueda
    if (this.filtroBusqueda.trim()) {
      const busqueda = this.filtroBusqueda.toLowerCase();
      filtradas = filtradas.filter(c =>
        c.usuarioNombre.toLowerCase().includes(busqueda) ||
        c.temaNombre.toLowerCase().includes(busqueda)
      );
    }

    this.certificacionesFiltradas = filtradas;
  }

  onFiltroEstadoChange(): void {
    this.aplicarFiltros();
  }

  onFiltroBusquedaChange(): void {
    this.aplicarFiltros();
  }

  obtenerEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'completada':
        return 'badge-success';
      case 'en_mentoria':
        return 'badge-warning';
      case 'pendiente':
        return 'badge-info';
      case 'rechazada':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  obtenerEstadoTexto(estado: string): string {
    const estados: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'en_mentoria': 'En Mentoría',
      'completada': 'Completada',
      'rechazada': 'Rechazada'
    };
    return estados[estado] || estado;
  }

  formatearFecha(fecha: Date | undefined): string {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

