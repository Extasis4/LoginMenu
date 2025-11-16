import { Component } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  template: `
    <div class="page-container">
      <h1>Usuarios</h1>
      <p>Gestión de usuarios</p>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
    }
    h1 {
      margin-bottom: 16px;
    }
  `]
})
export class UsuariosComponent {}

