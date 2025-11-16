import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, Business } from '../models';
import { UserService, BusinessService } from '../services';

@Component({
  selector: 'app-user-service-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="example-container">
      <h2>Ejemplo de uso de servicios</h2>
      
      <div class="section">
        <h3>Usuarios ({{ users.length }})</h3>
        <button (click)="loadUsers()">Cargar Usuarios</button>
        <button (click)="searchUsers('User1')">Buscar "User1"</button>
        
        <div *ngFor="let user of users" class="user-card">
          <h4>{{ user.name }} ({{ user.email }})</h4>
          <p>Rol: {{ user.roles }}</p>
          <p>Negocios: {{ user.businesses.length }}</p>
          
          <div *ngFor="let business of user.businesses" class="business-info">
            <strong>{{ business.name }}</strong> - 
            <span [class]="'status-' + business.status">{{ business.status }}</span>
            <span *ngIf="business.isSuccessful" class="success">✓ Exitoso</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Estadísticas</h3>
        <button (click)="loadStats()">Cargar Estadísticas</button>
        <pre *ngIf="stats">{{ stats | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .example-container {
      padding: 20px;
      max-width: 800px;
    }

    .section {
      margin-bottom: 30px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    .user-card {
      background: #f5f5f5;
      padding: 10px;
      margin: 10px 0;
      border-radius: 5px;
    }

    .business-info {
      margin: 5px 0;
      padding: 5px;
      background: white;
      border-radius: 3px;
    }

    .status-in_progress { color: #007bff; }
    .status-completed { color: #28a745; }
    .status-cancelled { color: #dc3545; }
    
    .success { color: #28a745; font-weight: bold; }

    button {
      margin: 5px;
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background: #0056b3;
    }
  `]
})
export class UserServiceExampleComponent implements OnInit {
  users: User[] = [];
  stats: any = null;

  constructor(
    private userService: UserService,
    private businessService: BusinessService
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios de usuarios
    this.userService.users$.subscribe(users => {
      console.log('Usuarios actualizados:', users);
    });
  }

  loadUsers() {
    this.userService.getUsers(1, 20).subscribe({
      next: (response) => {
        this.users = response.users;
        console.log('Usuarios cargados:', response);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        // Datos de ejemplo para pruebas
        this.loadMockData();
      }
    });
  }

  searchUsers(query: string) {
    this.userService.searchUsers(query).subscribe({
      next: (users) => {
        this.users = users;
        console.log('Resultados de búsqueda:', users);
      },
      error: (error) => {
        console.error('Error en búsqueda:', error);
      }
    });
  }

  loadStats() {
    this.userService.getUserStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        console.log('Estadísticas:', stats);
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        // Estadísticas de ejemplo
        this.stats = {
          totalUsers: this.users.length,
          activeUsers: this.users.filter(u => u.businesses.some(b => b.status === 'in_progress')).length,
          totalBusinesses: this.users.reduce((acc, u) => acc + u.businesses.length, 0)
        };
      }
    });
  }

  // Datos de ejemplo basados en tu API
  private loadMockData() {
    this.users = [
      {
        id: "56dd2ad7-25c6-49d5-af1f-6e63526e31de",
        name: "User105",
        email: "user105@example.com",
        age: null,
        city: null,
        rubroId: "39d39663-09e7-4b8b-aae9-dca9457e37de",
        googleId: null,
        moduleId: "095a52e8-da12-4405-aa70-ea1fe87ba71e",
        roles: "user",
        businesses: [{
          id: "3feb403a-1f19-4806-acbb-bca5ca17b014",
          name: "Negocio de User105",
          userId: "56dd2ad7-25c6-49d5-af1f-6e63526e31de",
          rubroId: "39d39663-09e7-4b8b-aae9-dca9457e37de",
          status: "in_progress",
          isSuccessful: false,
          createdAt: "2025-11-16T05:30:49.528Z",
          finalizedAt: null
        }]
      },
      {
        id: "86a7da4c-b5c3-488c-80d8-7139ab50eddc",
        name: "User110",
        email: "user110@example.com",
        age: null,
        city: null,
        rubroId: "39d39663-09e7-4b8b-aae9-dca9457e37de",
        googleId: null,
        moduleId: "16320e48-938e-42b9-99b5-8e90e79c641c",
        roles: "user",
        businesses: [{
          id: "f9e69ee5-dd68-4975-a3e0-511979f11cf2",
          name: "Negocio de User110",
          userId: "86a7da4c-b5c3-488c-80d8-7139ab50eddc",
          rubroId: "39d39663-09e7-4b8b-aae9-dca9457e37de",
          status: "in_progress",
          isSuccessful: false,
          createdAt: "2025-11-16T05:30:49.528Z",
          finalizedAt: null
        }]
      }
    ];
  }
}