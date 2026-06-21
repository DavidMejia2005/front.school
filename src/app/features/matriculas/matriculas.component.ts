import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Matricula } from '../../core/models/matricula.model';
import { Estudiante } from '../../core/models/estudiante.model';
import { Grado } from '../../core/models/grado.model';
import { MatriculasService } from '../../core/services/matriculas.service';
import { EstudiantesService } from '../../core/services/estudiantes.service';
import { GradosService } from '../../core/services/grados.service';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { StatusBadgePipe } from '../../shared/pipes/status-badge.pipe';

@Component({
  selector: 'app-matriculas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, StatusBadgePipe],
  templateUrl: './matriculas.component.html',
  styleUrl: './matriculas.component.scss',
})
export class MatriculasComponent implements OnInit {
  private fb = inject(FormBuilder);

  matriculas: Matricula[] = [];
  estudiantes: Estudiante[] = [];
  grados: Grado[] = [];

  filtroAnio = '';
  filtroEstado = '';

  modalOpen = false;
  saving = false;
  editingId: number | null = null;

  form = this.fb.group({
    estudiante_id: ['', Validators.required],
    grado_id: ['', Validators.required],
    año_lectivo: [new Date().getFullYear(), Validators.required],
    estado: ['activa', Validators.required],
  });

  constructor(
    private matriculasService: MatriculasService,
    private estudiantesService: EstudiantesService,
    private gradosService: GradosService,
    public authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.estudiantesService.getAll().subscribe((res) => { if (res.success) this.estudiantes = res.datos; });
    this.gradosService.getAll().subscribe((res) => { if (res.success) this.grados = res.datos; });
    this.loadMatriculas();
  }

  loadMatriculas(): void {
    this.matriculasService
      .getAll({ año_lectivo: this.filtroAnio, estado: this.filtroEstado })
      .subscribe({
        next: (res) => {
          if (res.success) this.matriculas = res.datos;
        },
        error: () => console.error('Error cargando matrículas'),
      });
  }

  nombreEstudiante(id: number): string {
    const e = this.estudiantes.find((x) => x.id === id);
    return e ? `${e.nombres} ${e.apellidos}` : String(id);
  }

  nombreGrado(id: number): string {
    return this.grados.find((g) => g.id === id)?.nombre || String(id);
  }

  abrirFormNuevo(): void {
    if (!this.authService.canPerform('create_matricula')) {
      this.alertService.show('No tienes permisos para crear matrículas', 'danger');
      return;
    }
    this.editingId = null;
    this.form.reset({ año_lectivo: new Date().getFullYear(), estado: 'activa' });
    this.modalOpen = true;
  }

  editar(mat: Matricula): void {
    if (!this.authService.canPerform('edit_matricula')) {
      this.alertService.show('No tienes permisos para editar matrículas', 'danger');
      return;
    }
    this.matriculasService.getOne(mat.id).subscribe({
      next: (res) => {
        if (res.success && res.datos) {
          const m = res.datos;
          this.editingId = m.id;
          this.form.setValue({
            estudiante_id: String(m.estudiante_id),
            grado_id: String(m.grado_id),
            año_lectivo: m.año_lectivo,
            estado: m.estado,
          });
          this.modalOpen = true;
        }
      },
      error: () => this.alertService.show('Error al cargar la matrícula', 'danger'),
    });
  }

  eliminar(id: number): void {
    if (!this.authService.canPerform('delete_matricula')) {
      this.alertService.show('No tienes permisos para eliminar matrículas', 'danger');
      return;
    }
    if (!confirm('¿Estás seguro de que deseas eliminar esta matrícula?')) return;

    this.matriculasService.delete(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.alertService.show('Matrícula eliminada correctamente', 'success');
          this.loadMatriculas();
        } else {
          this.alertService.show(res.mensaje || 'Error al eliminar', 'danger');
        }
      },
      error: () => this.alertService.show('Error en la operación', 'danger'),
    });
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertService.show('Por favor completa todos los campos requeridos', 'danger');
      return;
    }

    const v = this.form.value;
    const data = {
      estudiante_id: parseInt(v.estudiante_id!, 10),
      grado_id: parseInt(v.grado_id!, 10),
      año_lectivo: Number(v.año_lectivo),
      estado: v.estado as 'activa' | 'pausada' | 'finalizada',
    };

    this.saving = true;
    const request = this.editingId
      ? this.matriculasService.update(this.editingId, data)
      : this.matriculasService.create(data);

    request.subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.alertService.show(
            this.editingId ? 'Registro actualizado correctamente' : 'Registro creado correctamente',
            'success'
          );
          this.modalOpen = false;
          this.loadMatriculas();
        } else {
          this.alertService.show(res.mensaje || 'Error al guardar', 'danger');
        }
      },
      error: () => {
        this.saving = false;
        this.alertService.show('Error en la operación', 'danger');
      },
    });
  }
}
