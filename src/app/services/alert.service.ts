import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private messageSubject = new BehaviorSubject<string>('');
  public message$ = this.messageSubject.asObservable();

  constructor() { }

  success(message: string): void {
    this.messageSubject.next(message);
  }

  error(message: string): void {
    this.messageSubject.next(message);
  }

  clear(): void {
    this.messageSubject.next('');
  }
}