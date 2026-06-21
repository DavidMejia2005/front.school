import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Estudiante } from '../../core/models/estudiante.model';
import { Grado } from '../../core/models/grado.model';
import { EstudiantesService } from '../../core/services/estudiantes.service';
import { GradosService } from '../../core/services/grados.service';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { StatusBadgePipe } from '../../shared/pipes/status-badge.pipe';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, StatusBadgePipe],
  templateUrl: './estudiantes.component.html',
  styleUrl: './estudiantes.component.scss',
})
export class EstudiantesComponent implements OnInit {
  private fb = inject(FormBuilder);

  estudiantes: Estudiante[] = [];
  grados: Grado[] = [];

  searchTerm = '';
  filterGradoId = '';

  modalOpen = false;
  saving = false;
  editingId: number | null = null;

  form = this.fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: [''],
    fecha_nac: [''],
    grado_id: ['', Validators.required],
  });

  constructor(
    private estudiantesService: EstudiantesService,
    private gradosService: GradosService,
    public authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadGrados();
    this.loadEstudiantes();
  }

  loadGrados(): void {
    this.gradosService.getAll().subscribe({
      next: (res) => {
        if (res.success) this.grados = res.datos;
      },
      error: () => console.error('Error cargando grados'),
    });
  }

  loadEstudiantes(): void {
    this.estudiantesService
      .getAll({ buscar: this.searchTerm, grado_id: this.filterGradoId })
      .subscribe({
        next: (res) => {
          if (res.success) this.estudiantes = res.datos;
        },
        error: () => console.error('Error cargando estudiantes'),
      });
  }

  nombreGrado(gradoId: number): string {
    return this.grados.find((g) => g.id === gradoId)?.nombre || String(gradoId);
  }

  abrirFormNuevo(): void {
    if (!this.authService.canPerform('create_estudiante')) {
      this.alertService.show('No tienes permisos para crear estudiantes', 'danger');
      return;
    }
    this.editingId = null;
    this.form.reset();
    this.modalOpen = true;
  }

  editar(est: Estudiante): void {
    if (!this.authService.canPerform('edit_estudiante')) {
      this.alertService.show('No tienes permisos para editar estudiantes', 'danger');
      return;
    }
    this.estudiantesService.getOne(est.id).subscribe({
      next: (res) => {
        if (res.success && res.datos) {
          const e = res.datos;
          this.editingId = e.id;
          this.form.setValue({
            nombres: e.nombres,
            apellidos: e.apellidos,
            email: e.email,
            telefono: e.telefono || '',
            fecha_nac: e.fecha_nac || '',
            grado_id: String(e.grado_id),
          });
          this.modalOpen = true;
        }
      },
      error: () => this.alertService.show('Error al cargar el estudiante', 'danger'),
    });
  }

  eliminar(id: number): void {
    if (!this.authService.canPerform('delete_estudiante')) {
      this.alertService.show('No tienes permisos para eliminar estudiantes', 'danger');
      return;
    }
    if (!confirm('¿Estás seguro de que deseas eliminar este estudiante?')) return;

    this.estudiantesService.delete(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.alertService.show('Estudiante eliminado correctamente', 'success');
          this.loadEstudiantes();
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
      nombres: v.nombres!,
      apellidos: v.apellidos!,
      email: v.email!,
      telefono: v.telefono || '',
      fecha_nac: v.fecha_nac || '',
      grado_id: parseInt(v.grado_id!, 10),
    };

    this.saving = true;
    const request = this.editingId
      ? this.estudiantesService.update(this.editingId, data)
      : this.estudiantesService.create(data);

    request.subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.alertService.show(
            this.editingId ? 'Registro actualizado correctamente' : 'Registro creado correctamente',
            'success'
          );
          this.modalOpen = false;
          this.loadEstudiantes();
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
