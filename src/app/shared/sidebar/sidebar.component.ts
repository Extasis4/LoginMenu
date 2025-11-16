import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isOpen: boolean = true;
  @Output() closeSidebar = new EventEmitter<void>();

  get isMobile(): boolean {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  }

  menuItems: MenuItem[] = [
    {
      label: 'Panel',
      route: '/panel',
      icon: 'dashboard'
    },
    {
      label: 'Usuarios',
      route: '/usuarios',
      icon: 'users'
    },
    {
      label: 'Gestionar Contenido',
      route: '/gestion-contenido',
      icon: 'file-text'
    },
    {
      label: 'Gestionar Avance',
      route: '/gestion-avance',
      icon: 'check-circle'
    }
  ];

  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }

  onMenuClick() {
    // Cerrar sidebar en móvil al hacer clic en un enlace
    if (this.isMobile) {
      this.closeSidebar.emit();
    }
  }
}

