import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'demo_token';

  login(email: string, password: string): boolean {
    if (email === 'admin@demo.com' && password === '123456') {
      localStorage.setItem(this.TOKEN_KEY, 'logged_in');
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
