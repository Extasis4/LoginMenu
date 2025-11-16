import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'demo_token';

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    const user = 'admin@demo.com';
    const pass = '123456';

    if (email === user && password === pass) {
      localStorage.setItem(this.TOKEN_KEY, 'logged_in');
      // Redirigir al panel después del login exitoso
      this.router.navigate(['/panel']);
      return true;
    }

    return false;
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    // Redirigir al login después del logout
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
