import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DesignerService {
  private _preset = signal<any>(null);
  
  preset = this._preset.asReadonly();
  
  setPreset(value: any) {
    this._preset.set(value);
  }
  
  constructor() {
    // Inicializar con un valor por defecto
    this._preset.set(true);
  }
}

