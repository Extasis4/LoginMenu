import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { PanelComponent } from './pages/panel/panel.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ContenidoComponent } from './pages/contenido/contenido.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { AjustesComponent } from './pages/ajustes/ajustes.component';
import { authGuard } from './auth/auth.guard';
import { loginGuard } from './auth/login.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  { 
    path: 'panel', 
    component: PanelComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'usuarios', 
    component: UsuariosComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'contenido', 
    component: ContenidoComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'reportes', 
    component: ReportesComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'ajustes', 
    component: AjustesComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
