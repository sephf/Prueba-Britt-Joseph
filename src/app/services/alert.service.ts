import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Alert {
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<Alert | null>(null);
  public alert$: Observable<Alert | null> = this.alertSubject.asObservable();

  // Mantener compatibilidad con la API anterior
  private messageSubject = new BehaviorSubject<string>('');
  public message$ = this.messageSubject.asObservable();

  constructor() { }

  /**
   * Muestra una alerta de éxito
   */
  success(message: string): void {
    this.setAlert(message, 'success');
  }

  /**
   * Muestra una alerta de error
   */
  error(message: string): void {
    this.setAlert(message, 'danger');
  }

  /**
   * Muestra una alerta de advertencia
   */
  warning(message: string): void {
    this.setAlert(message, 'warning');
  }

  /**
   * Muestra una alerta de información
   */
  info(message: string): void {
    this.setAlert(message, 'info');
  }

  /**
   * Establece una alerta personalizada
   */
  private setAlert(message: string, type: 'success' | 'danger' | 'warning' | 'info'): void {
    this.alertSubject.next({ message, type });
    this.messageSubject.next(message); // Compatibilidad
  }

  /**
   * Limpia la alerta
   */
  clear(): void {
    this.alertSubject.next(null);
    this.messageSubject.next('');
  }
}