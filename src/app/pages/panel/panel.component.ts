import { Component } from '@angular/core';

@Component({
  selector: 'app-panel',
  standalone: true,
  template: `
    <div class="page-container">
      <h1>Panel</h1>
      <p>Bienvenido al panel de control</p>
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
export class PanelComponent {}

