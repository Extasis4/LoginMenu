import { Component } from '@angular/core';

@Component({
  selector: 'app-contenido',
  standalone: true,
  template: `
    <div class="page-container">
      <h1>Contenido</h1>
      <p>Gestión de contenido</p>
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
export class ContenidoComponent {}

