import { Routes } from '@angular/router';
import { PanelComponent } from './pages/panel/panel.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { GestionContenidoComponent } from './pages/gestion-contenido/gestion-contenido.component';
import { GestionAvanceComponent } from './pages/gestion-avance/gestion-avance.component';
import { LoginComponent } from './auth/login/login.component';
import { ApiTestComponent } from './components/api-test/api-test.component';
import { loginGuard } from './auth/login.guard';
import { authGuard } from './auth/auth.guard';

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
    path: 'gestion-contenido', 
    component: GestionContenidoComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'gestion-avance', 
    component: GestionAvanceComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'api-test', 
    component: ApiTestComponent
  },
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];
