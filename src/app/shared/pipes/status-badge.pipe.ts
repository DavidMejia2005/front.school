import { Pipe, PipeTransform } from '@angular/core';

export interface BadgeInfo {
  cssClass: string;
  label: string;
}

@Pipe({ name: 'statusBadge', standalone: true })
export class StatusBadgePipe implements PipeTransform {
  transform(status: string | boolean | null | undefined): BadgeInfo {
    const normalized = String(status).toLowerCase();

    if (normalized === 'true' || normalized === 'activo') {
      return { cssClass: 'bg-success', label: 'Activo' };
    }
    if (normalized === 'activa') {
      return { cssClass: 'bg-success', label: 'Activa' };
    }
    if (normalized === 'false' || normalized === 'inactivo') {
      return { cssClass: 'bg-danger', label: 'Inactivo' };
    }
    if (normalized === 'pausada') {
      return { cssClass: 'bg-warning', label: 'Pausada' };
    }
    if (normalized === 'finalizada') {
      return { cssClass: 'bg-secondary', label: 'Finalizada' };
    }
    return { cssClass: 'bg-secondary', label: String(status ?? '-') };
  }
}
