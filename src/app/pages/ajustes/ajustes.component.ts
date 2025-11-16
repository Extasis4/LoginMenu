import { Component } from '@angular/core';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  template: `
    <div class="page-container">
      <h1>Ajustes</h1>
      <p>Configuración del sistema</p>
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
export class AjustesComponent {}

