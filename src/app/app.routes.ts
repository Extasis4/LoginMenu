import { Routes } from '@angular/router';
import { PanelComponent } from './pages/panel/panel.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { GestionContenidoComponent } from './pages/gestion-contenido/gestion-contenido.component';
import { GestionAvanceComponent } from './pages/gestion-avance/gestion-avance.component';

export const routes: Routes = [
  { 
    path: 'panel', 
    component: PanelComponent,
  },
  { 
    path: 'usuarios', 
    component: UsuariosComponent,
  },
  { 
    path: 'gestion-contenido', 
    component: GestionContenidoComponent,
  },
  { 
    path: 'gestion-avance', 
    component: GestionAvanceComponent,
  },
  { 
    path: '**', redirectTo: 'panel' }
];
