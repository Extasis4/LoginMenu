import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContenidoService } from '../../services/contenido.service';
import { Contenido, TipoContenido, CategoriaContenido, ContenidoFormData } from '../../models/contenido.model';

@Component({
  selector: 'app-gestion-contenido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-contenido.component.html',
  styleUrls: ['./gestion-contenido.component.css']
})
export class GestionContenidoComponent implements OnInit {
  contenidos: Contenido[] = [];
  contenidosFiltrados: Contenido[] = [];
  
  // Estados
  cargando = false;
  subiendo = false;
  procesando = false;
  
  // Filtros
  filtroTipo: TipoContenido | null = null;
  filtroCategoria: CategoriaContenido | 'todas' = 'todas';
  
  // Formulario
  formData: ContenidoFormData = {
    archivo: null,
    titulo: '',
    descripcion: '',
    categoria: 'Pre-Incubacion'
  };
  
  // Drag & Drop
  isDragging = false;
  
  // Modal de edición
  mostrarModalEdicion = false;
  contenidoEditando: Contenido | null = null;
  datosEdicion: { titulo: string; descripcion: string; categoria: CategoriaContenido } = {
    titulo: '',
    descripcion: '',
    categoria: 'Pre-Incubacion'
  };

  constructor(private contenidoService: ContenidoService) {}

  ngOnInit(): void {
    this.cargarContenidos();
  }

  cargarContenidos(): void {
    this.cargando = true;
    this.contenidoService.obtenerContenidosPorTipo(this.filtroTipo).subscribe({
      next: (contenidos) => {
        this.contenidos = contenidos;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar contenidos:', error);
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    let filtrados = [...this.contenidos];

    // Filtrar por categoría
    if (this.filtroCategoria !== 'todas') {
      filtrados = filtrados.filter(c => c.categoria === this.filtroCategoria);
    }

    this.contenidosFiltrados = filtrados;
  }

  onFiltroChange(tipo: TipoContenido | null): void {
    this.filtroTipo = tipo;
    this.cargarContenidos();
  }

  onFiltroCategoriaChange(): void {
    this.aplicarFiltros();
  }

  // Drag & Drop handlers
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  abrirSelectorArchivos(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File): void {
    // Validar tipo de archivo
    const esVideo = file.type.startsWith('video/');
    const esPDF = file.type === 'application/pdf';

    if (!esVideo && !esPDF) {
      alert('Solo se permiten archivos de video o PDF');
      return;
    }

    // Validar tamaño (máx. 500MB)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('El archivo excede el tamaño máximo de 500MB');
      return;
    }

    this.formData.archivo = file;
  }

  eliminarArchivo(): void {
    this.formData.archivo = null;
  }

  subirContenido(): void {
    if (!this.formData.archivo) {
      alert('Por favor selecciona un archivo');
      return;
    }

    if (!this.formData.titulo.trim()) {
      alert('Por favor ingresa un título');
      return;
    }

    if (!this.formData.descripcion.trim()) {
      alert('Por favor ingresa una descripción');
      return;
    }

    this.subiendo = true;
    this.contenidoService.subirContenido(this.formData).subscribe({
      next: (contenido) => {
        console.log('Contenido subido:', contenido);
        this.resetForm();
        this.cargarContenidos();
        this.subiendo = false;
        alert('Contenido subido exitosamente');
      },
      error: (error) => {
        console.error('Error al subir contenido:', error);
        alert('Error al subir el contenido: ' + (error.message || 'Error desconocido'));
        this.subiendo = false;
      }
    });
  }

  resetForm(): void {
    this.formData = {
      archivo: null,
      titulo: '',
      descripcion: '',
      categoria: 'Pre-Incubacion'
    };
  }

  abrirModalEdicion(contenido: Contenido): void {
    this.contenidoEditando = contenido;
    this.datosEdicion = {
      titulo: contenido.titulo,
      descripcion: contenido.descripcion,
      categoria: contenido.categoria
    };
    this.mostrarModalEdicion = true;
  }

  cerrarModalEdicion(): void {
    this.mostrarModalEdicion = false;
    this.contenidoEditando = null;
    this.datosEdicion = {
      titulo: '',
      descripcion: '',
      categoria: 'Pre-Incubacion'
    };
  }

  guardarEdicion(): void {
    if (!this.contenidoEditando) return;

    if (!this.datosEdicion.titulo.trim()) {
      alert('Por favor ingresa un título');
      return;
    }

    if (!this.datosEdicion.descripcion.trim()) {
      alert('Por favor ingresa una descripción');
      return;
    }

    this.procesando = true;
    this.contenidoService.actualizarContenido(this.contenidoEditando.id, {
      titulo: this.datosEdicion.titulo,
      descripcion: this.datosEdicion.descripcion,
      categoria: this.datosEdicion.categoria
    }).subscribe({
      next: (contenido) => {
        console.log('Contenido actualizado:', contenido);
        this.cerrarModalEdicion();
        this.cargarContenidos();
        this.procesando = false;
        alert('Contenido actualizado exitosamente');
      },
      error: (error) => {
        console.error('Error al actualizar contenido:', error);
        alert('Error al actualizar el contenido');
        this.procesando = false;
      }
    });
  }

  eliminarContenido(contenido: Contenido): void {
    if (!confirm(`¿Estás seguro de eliminar "${contenido.titulo}"?`)) {
      return;
    }

    this.procesando = true;
    this.contenidoService.eliminarContenido(contenido.id).subscribe({
      next: () => {
        console.log('Contenido eliminado');
        this.cargarContenidos();
        this.procesando = false;
        alert('Contenido eliminado exitosamente');
      },
      error: (error) => {
        console.error('Error al eliminar contenido:', error);
        alert('Error al eliminar el contenido');
        this.procesando = false;
      }
    });
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  formatearTamanio(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  obtenerIconoTipo(tipo: TipoContenido): string {
    return tipo === 'video' ? '🎥' : '📄';
  }
}

