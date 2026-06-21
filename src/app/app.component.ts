import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertsComponent } from './shared/components/alerts/alerts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertsComponent],
  template: `
    <app-alerts></app-alerts>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
