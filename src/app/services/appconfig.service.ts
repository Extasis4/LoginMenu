import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private _transitionComplete = signal(false);
  
  transitionComplete = computed(() => this._transitionComplete());
  
  setTransitionComplete(value: boolean) {
    this._transitionComplete.set(value);
  }
  
  // Inicializar como completado por defecto
  constructor() {
    this._transitionComplete.set(true);
  }
}

