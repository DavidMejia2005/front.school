import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'notaBadge', standalone: true })
export class NotaBadgePipe implements PipeTransform {
  transform(nota: number | string): string {
    const value = parseFloat(String(nota));
    if (value >= 4.5) return 'bg-success';
    if (value >= 3.5) return 'bg-warning';
    if (value >= 3) return 'bg-info';
    return 'bg-danger';
  }
}
