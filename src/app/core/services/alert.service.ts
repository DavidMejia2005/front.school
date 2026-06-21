import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AlertType = 'success' | 'danger' | 'warning' | 'info';

export interface AlertMessage {
  id: number;
  type: AlertType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private nextId = 1;
  private readonly alertsSubject = new BehaviorSubject<AlertMessage[]>([]);
  readonly alerts$ = this.alertsSubject.asObservable();

  show(message: string, type: AlertType = 'info', durationMs = 4000): void {
    const alert: AlertMessage = { id: this.nextId++, type, message };
    this.alertsSubject.next([...this.alertsSubject.value, alert]);

    if (durationMs > 0) {
      setTimeout(() => this.remove(alert.id), durationMs);
    }
  }

  remove(id: number): void {
    this.alertsSubject.next(this.alertsSubject.value.filter((a) => a.id !== id));
  }
}
