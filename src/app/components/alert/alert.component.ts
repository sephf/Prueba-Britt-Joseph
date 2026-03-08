import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService, Alert } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  message: string = '';
  type: 'success' | 'danger' | 'warning' | 'info' = 'success';
  private subscription!: Subscription;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.subscription = this.alertService.alert$.subscribe((alert: Alert | null) => {
      if (alert) {
        this.message = alert.message;
        this.type = alert.type;
      } else {
        this.message = '';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Retorna la clase del icono según el tipo de alerta
   */
  getIconClass(): string {
    const iconMap = {
      success: 'bi bi-check-circle-fill',
      danger: 'bi bi-exclamation-circle-fill',
      warning: 'bi bi-exclamation-triangle-fill',
      info: 'bi bi-info-circle-fill'
    };
    return iconMap[this.type];
  }

  close(): void {
    this.message = '';
    this.alertService.clear();
  }
}
