import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  showSidebar = false;
  sidebarOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Verificar estado inicial
    this.updateSidebarVisibility();

    // Escuchar cambios de ruta para actualizar el sidebar
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateSidebarVisibility();
        // Cerrar sidebar en móvil al navegar
        if (window.innerWidth <= 768) {
          this.sidebarOpen = false;
        }
      });

    // Escuchar cambios de tamaño de ventana
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        this.handleResize();
      });
    }
  }

  private handleResize() {
    // En desktop, mantener el sidebar abierto; en móvil, cerrarlo
    if (window.innerWidth > 768) {
      if (this.showSidebar) {
        this.sidebarOpen = true;
      }
    } else {
      // En móvil, cerrar el sidebar si está abierto
      if (this.sidebarOpen) {
        this.sidebarOpen = false;
      }
    }
  }

  private updateSidebarVisibility() {
    const isAuthenticated = this.authService.isAuthenticated();
    const currentUrl = this.router.url;
    const isLoginRoute = currentUrl === '/login' || currentUrl === '/' || currentUrl.startsWith('/login');
    
    // Mostrar sidebar solo si está autenticado Y no está en la ruta de login
    this.showSidebar = isAuthenticated && !isLoginRoute;
    
    // En desktop, mantener el sidebar abierto por defecto; en móvil, cerrado
    if (this.showSidebar) {
      this.sidebarOpen = window.innerWidth > 768;
    } else {
      this.sidebarOpen = false;
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }
}
