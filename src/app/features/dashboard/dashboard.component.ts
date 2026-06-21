import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EstudiantesService } from '../../core/services/estudiantes.service';
import { ProfesoresService } from '../../core/services/profesores.service';
import { MateriasService } from '../../core/services/materias.service';
import { GradosService } from '../../core/services/grados.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  totalEstudiantes = 0;
  totalProfesores = 0;
  totalMaterias = 0;
  totalGrados = 0;
  loading = true;

  constructor(
    private estudiantesService: EstudiantesService,
    private profesoresService: ProfesoresService,
    private materiasService: MateriasService,
    private gradosService: GradosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    forkJoin({
      estudiantes: this.estudiantesService.getAll(),
      profesores: this.profesoresService.getAll(),
      materias: this.materiasService.getAll(),
      grados: this.gradosService.getAll(),
    }).subscribe({
      next: ({ estudiantes, profesores, materias, grados }) => {
        this.totalEstudiantes = estudiantes.datos?.length ?? 0;
        this.totalProfesores = profesores.datos?.length ?? 0;
        this.totalMaterias = materias.datos?.length ?? 0;
        this.totalGrados = grados.datos?.length ?? 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }
}
