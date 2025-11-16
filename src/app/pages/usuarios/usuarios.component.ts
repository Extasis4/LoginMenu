import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

// PrimeNG imports
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { User, Business } from '../../models';
import { UserService, RubroService, Rubro } from '../../services';

type TagSeverity = "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined;

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    ProgressSpinnerModule,
    PaginatorModule,
    DialogModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit, OnDestroy {
  // Datos
  users: User[] = [];
  allUsers: User[] = []; // Almacenar todos los usuarios cargados
  rubros: Rubro[] = [];
  
  // Filtros
  selectedRubro: string | null = null;
  searchName: string = '';
  searchBusiness: string = '';
  
  // Estado
  loading = false;
  
  // Paginación
  currentPage = 1;
  pageSize = 12;
  totalUsers = 0;
  
  // Dialog
  showUserDialog = false;
  selectedUser: User | null = null;
  
  // Observables
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private userService: UserService,
    private rubroService: RubroService,
    private messageService: MessageService
  ) {
    // Configurar búsqueda con debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.searchUsers();
    });
  }

  ngOnInit() {
    console.log('Inicializando componente de usuarios...');
    this.loadRubros();
    this.testApiConnection();
  }

  // Probar conexión con la API
  testApiConnection() {
    console.log('🔄 Recargando usuarios desde la API...');
    
    // Limpiar usuarios existentes para forzar recarga
    this.allUsers = [];
    this.users = [];
    
    // Cargar usuarios desde la API
    this.loadAllUsersFromApi();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Cargar rubros para el dropdown
  loadRubros() {
    console.log('Cargando rubros desde API...');
    this.rubroService.getRubros().subscribe({
      next: (rubros) => {
        console.log('Rubros recibidos:', rubros);
        this.rubros = Array.isArray(rubros) ? rubros : [];
      },
      error: (error) => {
        console.error('Error loading rubros:', error);
        this.rubros = [];
        this.handleError('Error al cargar rubros');
      }
    });
  }

  // Cargar usuarios
  loadUsers() {
    // Si ya tenemos todos los usuarios cargados, solo aplicar filtros
    if (this.allUsers.length > 0) {
      console.log('Aplicando filtros a usuarios ya cargados...');
      this.applyFilters();
      return;
    }

    // Si no tenemos usuarios, cargarlos desde la API
    this.loadAllUsersFromApi();
  }

  // Cargar TODOS los usuarios desde la API (del rubro principal que tiene usuarios)
  private loadAllUsersFromApi() {
    this.loading = true;
    console.log('Cargando TODOS los usuarios desde la API...');
    
    // Cargar usuarios del rubro que sabemos que tiene datos
    this.userService.getUsersByRubro('39d39663-09e7-4b8b-aae9-dca9457e37de')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          console.log('Todos los usuarios recibidos de la API:', users);
          const usersArray = Array.isArray(users) ? users : [];
          
          // Guardar todos los usuarios
          this.allUsers = usersArray;
          
          // Aplicar filtros
          this.applyFilters();
          this.loading = false;
          
          console.log(`✅ Cargados ${this.allUsers.length} usuarios total`);
        },
        error: (error) => {
          console.error('Error loading all users from API:', error);
          this.handleError('Error al cargar usuarios de la API');
          this.allUsers = [];
          this.users = [];
          this.totalUsers = 0;
          this.loading = false;
        }
      });
  }

  // Aplicar todos los filtros localmente
  private applyFilters() {
    console.log('Aplicando filtros localmente...');
    let filteredUsers = [...this.allUsers]; // Copia de todos los usuarios

    // Filtrar por rubro seleccionado
    if (this.selectedRubro) {
      filteredUsers = filteredUsers.filter(user => user.rubroId === this.selectedRubro);
      console.log(`Después de filtrar por rubro ${this.selectedRubro}:`, filteredUsers.length);
    }

    // Filtrar por nombre
    if (this.searchName.trim()) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(this.searchName.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchName.toLowerCase())
      );
      console.log('Después de filtrar por nombre:', filteredUsers.length);
    }

    // Filtrar por idea de negocio
    if (this.searchBusiness.trim()) {
      filteredUsers = filteredUsers.filter(user => 
        user.businesses.some(business => 
          business.name.toLowerCase().includes(this.searchBusiness.toLowerCase())
        )
      );
      console.log('Después de filtrar por negocio:', filteredUsers.length);
    }

    this.users = filteredUsers;
    this.totalUsers = this.users.length;

    console.log(`📊 Resultado final: ${this.users.length} usuarios mostrados de ${this.allUsers.length} total`);

    // Mostrar mensaje si no hay resultados
    if (this.users.length === 0 && this.allUsers.length > 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Sin resultados',
        detail: 'No se encontraron usuarios con los filtros aplicados'
      });
    }
  }





  // Eventos de filtros
  onRubroChange() {
    console.log('Cambio de rubro a:', this.selectedRubro);
    this.currentPage = 1;
    this.applyFilters(); // Solo aplicar filtros, no recargar desde API
  }

  onSearchChange() {
    this.searchSubject.next('search');
  }

  searchUsers() {
    console.log('Ejecutando búsqueda...');
    this.currentPage = 1;
    this.applyFilters(); // Solo aplicar filtros, no recargar desde API
  }

  clearFilters() {
    console.log('Limpiando todos los filtros...');
    this.selectedRubro = null;
    this.searchName = '';
    this.searchBusiness = '';
    this.currentPage = 1;
    this.applyFilters(); // Solo aplicar filtros, no recargar desde API
  }

  // Paginación
  onPageChange(event: any) {
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.loadUsers();
  }

  // Acciones de usuario
  viewUserDetails(user: User) {
    this.selectedUser = user;
    this.showUserDialog = true;
  }

  contactUser(user: User) {
    // Implementar lógica de contacto
    this.messageService.add({
      severity: 'info',
      summary: 'Contactar Usuario',
      detail: `Funcionalidad de contacto para ${user.name}`
    });
  }

  // Métodos de utilidad
  getRubroName(rubroId: string): string {
    const rubro = this.rubros.find(r => r.id === rubroId);
    return rubro ? rubro.name : `Rubro (${rubroId.substring(0, 8)}...)`;
  }

  getRoleSeverity(role: string): TagSeverity {
    switch (role) {
      case 'admin': return 'danger';
      case 'moderator': return 'warn';
      case 'user': return 'info';
      default: return 'secondary';
    }
  }

  getBusinessStatusSeverity(status: string): TagSeverity {
    switch (status) {
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  }

  getBusinessStatusLabel(status: string): string {
    switch (status) {
      case 'in_progress': return 'En Progreso';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  }

  // Estadísticas
  getTotalBusinesses(): number {
    return this.users.reduce((total, user) => total + user.businesses.length, 0);
  }

  getActiveBusinesses(): number {
    return this.users.reduce((total, user) => 
      total + user.businesses.filter(b => b.status === 'in_progress').length, 0
    );
  }

  // Manejo de errores
  private handleError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }
}

