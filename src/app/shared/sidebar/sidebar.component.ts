import { Component } from '@angular/core';
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
      label: 'Contenido',
      route: '/contenido',
      icon: 'content'
    },
    {
      label: 'Reportes',
      route: '/reportes',
      icon: 'reports'
    },
    {
      label: 'Ajustes',
      route: '/ajustes',
      icon: 'settings'
    }
  ];

  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }
}

