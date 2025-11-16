import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models';
import { UserService } from '../../services';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="api-test-container">
      <h2>Prueba de API - Usuarios por Rubro</h2>
      
      <div class="test-section">
        <button (click)="testApiCall()" [disabled]="loading">
          {{ loading ? 'Cargando...' : 'Probar API' }}
        </button>
        
        <div *ngIf="error" class="error">
          <strong>Error:</strong> {{ error }}
        </div>
        
        <div *ngIf="users.length > 0" class="results">
          <h3>Usuarios encontrados: {{ users.length }}</h3>
          
          <div *ngFor="let user of users" class="user-card">
            <div class="user-header">
              <h4>{{ user.name }}</h4>
              <span class="user-email">{{ user.email }}</span>
            </div>
            
            <div class="user-details">
              <p><strong>ID:</strong> {{ user.id }}</p>
              <p><strong>Rol:</strong> {{ user.roles }}</p>
              <p><strong>Rubro ID:</strong> {{ user.rubroId }}</p>
              <p><strong>Módulo ID:</strong> {{ user.moduleId }}</p>
              <p><strong>Edad:</strong> {{ user.age || 'No especificada' }}</p>
              <p><strong>Ciudad:</strong> {{ user.city || 'No especificada' }}</p>
            </div>
            
            <div *ngIf="user.businesses && user.businesses.length > 0" class="businesses">
              <h5>Negocios ({{ user.businesses.length }}):</h5>
              <div *ngFor="let business of user.businesses" class="business-item">
                <div class="business-header">
                  <strong>{{ business.name }}</strong>
                  <span class="status" [class]="'status-' + business.status">
                    {{ business.status }}
                  </span>
                </div>
                <div class="business-details">
                  <small>Creado: {{ business.createdAt | date:'short' }}</small>
                  <small *ngIf="business.finalizedAt">
                    | Finalizado: {{ business.finalizedAt | date:'short' }}
                  </small>
                  <small>
                    | Exitoso: {{ business.isSuccessful ? 'Sí' : 'No' }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div *ngIf="rawResponse" class="raw-response">
          <h4>Respuesta completa de la API:</h4>
          <pre>{{ rawResponse | json }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .api-test-container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .test-section {
      margin: 20px 0;
    }

    button {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }

    button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
      background: #0056b3;
    }

    .error {
      background: #f8d7da;
      color: #721c24;
      padding: 10px;
      border-radius: 5px;
      margin: 10px 0;
      border: 1px solid #f5c6cb;
    }

    .results {
      margin-top: 20px;
    }

    .user-card {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 15px;
      margin: 10px 0;
    }

    .user-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      border-bottom: 1px solid #dee2e6;
      padding-bottom: 10px;
    }

    .user-header h4 {
      margin: 0;
      color: #495057;
    }

    .user-email {
      color: #6c757d;
      font-style: italic;
    }

    .user-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin: 10px 0;
    }

    .user-details p {
      margin: 5px 0;
      font-size: 14px;
    }

    .businesses {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #dee2e6;
    }

    .businesses h5 {
      margin: 0 0 10px 0;
      color: #495057;
    }

    .business-item {
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 5px;
      padding: 10px;
      margin: 5px 0;
    }

    .business-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }

    .status {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }

    .status-in_progress {
      background: #cce5ff;
      color: #0066cc;
    }

    .status-completed {
      background: #d4edda;
      color: #155724;
    }

    .status-cancelled {
      background: #f8d7da;
      color: #721c24;
    }

    .business-details {
      font-size: 12px;
      color: #6c757d;
    }

    .raw-response {
      margin-top: 30px;
      padding: 15px;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 5px;
    }

    .raw-response pre {
      background: white;
      padding: 10px;
      border-radius: 3px;
      overflow-x: auto;
      font-size: 12px;
    }
  `]
})
export class ApiTestComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  rawResponse: any = null;

  // ID del rubro de ejemplo de tu API
  private readonly RUBRO_ID = '39d39663-09e7-4b8b-aae9-dca9457e37de';

  constructor(
    private userService: UserService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Cargar automáticamente al iniciar
    this.testApiCall();
  }

  testApiCall() {
    this.loading = true;
    this.error = null;
    this.users = [];
    this.rawResponse = null;

    console.log('Probando API:', `https://api.childfound.online/api/rubros/${this.RUBRO_ID}/users`);

    this.userService.getUsersByRubro(this.RUBRO_ID).subscribe({
      next: (users) => {
        console.log('Usuarios recibidos:', users);
        this.users = users;
        this.rawResponse = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.error = error.message || 'Error desconocido';
        this.loading = false;
        
        // Intentar llamada directa para debug
        this.testDirectApiCall();
      }
    });
  }

  private testDirectApiCall() {
    console.log('Intentando llamada directa a la API...');
    
    this.http.get(`https://api.childfound.online/api/rubros/${this.RUBRO_ID}/users`).subscribe({
      next: (response) => {
        console.log('Respuesta directa de la API:', response);
        this.rawResponse = response;
        
        // Si la respuesta es un array, asignarlo a users
        if (Array.isArray(response)) {
          this.users = response as User[];
        }
      },
      error: (error) => {
        console.error('Error en llamada directa:', error);
        this.error = `Error directo: ${error.message}`;
      }
    });
  }
}