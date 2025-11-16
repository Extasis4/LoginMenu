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
  certificacionesPaginadas: Certificacion[] = [];
  paginaActual = 1;
  tamPagina = 10;
  totalPaginas = 0;
  usuarioSeleccionado: Usuario | null = null;
  certificacionSeleccionada: Certificacion | null = null;
  
  // Estados de carga
  cargandoUsuarios = false;
  cargandoCertificaciones = false;
  procesando = false;
  // Preview certificado
  mostrarPreview = false;
  previewUrl: string | null = null;
  
  // Filtros
  filtroEstado: 'todos' | 'pendiente' | 'en_mentoria' | 'completada' | 'rechazada' = 'todos';
  filtroBusqueda = '';
  
  // Modal de confirmación
  mostrarModalConfirmacion = false;
  observacionesMentoria = '';
  usuarioConfirmar: { certificacionId?: string; usuarioId: string; usuarioNombre: string; temaId: string; temaNombre: string } | null = null;

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
      certificacionId: certificacion.id,
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
    if (!this.usuarioConfirmar.certificacionId) {
      console.error('No hay certificacionId para actualizar.');
      this.procesando = false;
      return;
    }
    this.gestionAvanceService.actualizarCertificacionProgreso(this.usuarioConfirmar.certificacionId)
      .subscribe({
        next: (resp: any) => {
          // Tras completar, mintear NFT para obtener tx/contract
          const name = this.usuarioConfirmar!.usuarioNombre;
          const topic = this.usuarioConfirmar!.temaNombre;
          this.gestionAvanceService.mintSimple(name, topic).subscribe({
            next: (mint: any) => {
              const img = String(mint?.imageUri || '');
              const upd = (arr: Certificacion[]) => {
                const idx = arr.findIndex(c => c.id === this.usuarioConfirmar!.certificacionId);
                if (idx >= 0) arr[idx] = { 
                  ...arr[idx], 
                  urlImage: img || arr[idx].urlImage, 
                  backendStatus: 'completed',
                  contractAddress: mint?.contractAddress ?? arr[idx].contractAddress,
                  tokenId: mint?.tokenId ?? arr[idx].tokenId,
                  txHash: mint?.txHash ?? arr[idx].txHash
                };
              };
              upd(this.certificaciones);
              upd(this.certificacionesFiltradas);
              this.recalcularPaginacion();

              if (img) {
                const cid = img.replace(/^ipfs:\/\//, '');
                this.previewUrl = `https://ipfs.io/ipfs/${cid}`;
                this.mostrarPreview = true;
              } else {
                this.cargarDatos();
              }
              this.cerrarModalConfirmacion();
              this.procesando = false;
            },
            error: (e) => {
              console.error('Error al mintear NFT:', e);
              // Aún así cerrar modal y refrescar
              this.cerrarModalConfirmacion();
              this.cargarDatos();
              this.procesando = false;
            }
          });
        },
        error: (error) => {
          console.error('Error al confirmar aprendizaje:', error);
          this.procesando = false;
        }
      });
  }

  abrirPreview(ipfsUri: string): void {
    const cid = ipfsUri.replace(/^ipfs:\/\//, '');
    this.previewUrl = `https://ipfs.io/ipfs/${cid}`;
    this.mostrarPreview = true;
  }

  cerrarPreview(): void {
    this.mostrarPreview = false;
    this.previewUrl = null;
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
    this.paginaActual = 1;
    this.recalcularPaginacion();
  }

  onFiltroEstadoChange(): void {
    this.aplicarFiltros();
  }

  onFiltroBusquedaChange(): void {
    this.aplicarFiltros();
  }

  obtenerEstadoBadgeClass(backendStatus?: string): string {
    switch (backendStatus) {
      case 'completed':
        return 'badge-success';
      case 'in_progress':
        return 'badge-warning';
      case 'pending':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  }

  obtenerEstadoTexto(backendStatus?: string): string {
    const estados: { [key: string]: string } = {
      'pending': 'Pendiente',
      'in_progress': 'En progreso',
      'completed': 'Completado'
    };
    return estados[backendStatus || ''] || (backendStatus || '-');
  }

  formatearFecha(fecha: Date | undefined): string {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  private recalcularPaginacion(): void {
    this.totalPaginas = Math.max(1, Math.ceil(this.certificacionesFiltradas.length / this.tamPagina));
    if (this.paginaActual > this.totalPaginas) this.paginaActual = this.totalPaginas;
    const inicio = (this.paginaActual - 1) * this.tamPagina;
    const fin = inicio + this.tamPagina;
    this.certificacionesPaginadas = this.certificacionesFiltradas.slice(inicio, fin);
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.recalcularPaginacion();
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.recalcularPaginacion();
    }
  }
}

