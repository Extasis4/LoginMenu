import { Component } from '@angular/core';

@Component({
  selector: 'app-reportes',
  standalone: true,
  template: `
    <div class="page-container">
      <h1>Reportes</h1>
      <p>Visualización de reportes</p>
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
export class ReportesComponent {}

