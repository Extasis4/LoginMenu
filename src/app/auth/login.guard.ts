import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard que previene el acceso al login si el usuario ya está autenticado.
 * Si el usuario está autenticado, lo redirige al panel.
 */
export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Si ya está autenticado, redirigir al panel
    router.navigate(['/panel']);
    return false;
  }

  // Si no está autenticado, permitir acceso al login
  return true;
};

