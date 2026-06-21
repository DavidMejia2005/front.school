import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Nota } from '../../core/models/nota.model';
import { Estudiante } from '../../core/models/estudiante.model';
import { Materia } from '../../core/models/materia.model';
import { Profesor } from '../../core/models/profesor.model';
import { NotasService } from '../../core/services/notas.service';
import { EstudiantesService } from '../../core/services/estudiantes.service';
import { MateriasService } from '../../core/services/materias.service';
import { ProfesoresService } from '../../core/services/profesores.service';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { NotaBadgePipe } from '../../shared/pipes/nota-badge.pipe';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, NotaBadgePipe],
  templateUrl: './notas.component.html',
  styleUrl: './notas.component.scss',
})
export class NotasComponent implements OnInit {
  private fb = inject(FormBuilder);

  notas: Nota[] = [];
  estudiantes: Estudiante[] = [];
  materias: Materia[] = [];
  profesores: Profesor[] = [];

  filtroEstudianteId = '';
  filtroMateriaId = '';
  filtroPeriodo = '';

  modalOpen = false;
  saving = false;
  editingId: number | null = null;

  form = this.fb.group({
    estudiante_id: ['', Validators.required],
    materia_id: ['', Validators.required],
    profesor_id: ['', Validators.required],
    periodo: ['', Validators.required],
    año_lectivo: [new Date().getFullYear(), Validators.required],
    nota: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    observaciones: [''],
  });

  constructor(
    private notasService: NotasService,
    private estudiantesService: EstudiantesService,
    private materiasService: MateriasService,
    private profesoresService: ProfesoresService,
    public authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.estudiantesService.getAll().subscribe((res) => { if (res.success) this.estudiantes = res.datos; });
    this.materiasService.getAll().subscribe((res) => { if (res.success) this.materias = res.datos; });
    this.profesoresService.getAll().subscribe((res) => { if (res.success) this.profesores = res.datos; });
    this.loadNotas();
  }

  loadNotas(): void {
    this.notasService
      .getAll({
        estudiante_id: this.filtroEstudianteId,
        materia_id: this.filtroMateriaId,
        periodo: this.filtroPeriodo,
      })
      .subscribe({
        next: (res) => {
          if (res.success) this.notas = res.datos;
        },
        error: () => console.error('Error cargando notas'),
      });
  }

  nombreEstudiante(id: number): string {
    const e = this.estudiantes.find((x) => x.id === id);
    return e ? `${e.nombres} ${e.apellidos}` : String(id);
  }

  nombreMateria(id: number): string {
    return this.materias.find((m) => m.id === id)?.nombre || String(id);
  }

  nombreProfesor(id: number): string {
    const p = this.profesores.find((x) => x.id === id);
    return p ? `${p.nombres} ${p.apellidos}` : String(id);
  }

  abrirFormNuevo(): void {
    if (!this.authService.canPerform('register_nota')) {
      this.alertService.show('No tienes permisos para registrar notas', 'danger');
      return;
    }
    this.editingId = null;
    this.form.reset({ año_lectivo: new Date().getFullYear(), nota: 0 });
    this.modalOpen = true;
  }

  editar(nota: Nota): void {
    if (!this.authService.canPerform('edit_nota')) {
      this.alertService.show('No tienes permisos para editar notas', 'danger');
      return;
    }
    this.notasService.getOne(nota.id).subscribe({
      next: (res) => {
        if (res.success && res.datos) {
          const n = res.datos;
          this.editingId = n.id;
          this.form.setValue({
            estudiante_id: String(n.estudiante_id),
            materia_id: String(n.materia_id),
            profesor_id: String(n.profesor_id),
            periodo: String(n.periodo),
            año_lectivo: n.año_lectivo,
            nota: n.nota,
            observaciones: n.observaciones || '',
          });
          this.modalOpen = true;
        }
      },
      error: () => this.alertService.show('Error al cargar la nota', 'danger'),
    });
  }

  eliminar(id: number): void {
    if (!this.authService.canPerform('delete_nota')) {
      this.alertService.show('No tienes permisos para eliminar notas', 'danger');
      return;
    }
    if (!confirm('¿Estás seguro de que deseas eliminar esta nota?')) return;

    this.notasService.delete(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.alertService.show('Nota eliminada correctamente', 'success');
          this.loadNotas();
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
      materia_id: parseInt(v.materia_id!, 10),
      profesor_id: parseInt(v.profesor_id!, 10),
      periodo: parseInt(v.periodo!, 10),
      año_lectivo: Number(v.año_lectivo),
      nota: Number(v.nota),
      observaciones: v.observaciones || '',
    };

    this.saving = true;
    const request = this.editingId
      ? this.notasService.update(this.editingId, data)
      : this.notasService.create(data);

    request.subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.alertService.show(
            this.editingId ? 'Registro actualizado correctamente' : 'Registro creado correctamente',
            'success'
          );
          this.modalOpen = false;
          this.loadNotas();
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
