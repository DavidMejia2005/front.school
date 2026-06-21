import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Materia } from '../../core/models/materia.model';
import { MateriasService } from '../../core/services/materias.service';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './materias.component.html',
  styleUrl: './materias.component.scss',
})
export class MateriasComponent implements OnInit {
  private fb = inject(FormBuilder);

  materias: Materia[] = [];

  modalOpen = false;
  saving = false;
  editingId: number | null = null;

  form = this.fb.group({
    nombre: ['', Validators.required],
    codigo: ['', Validators.required],
    descripcion: [''],
    creditos: [1, [Validators.required, Validators.min(1)]],
  });

  constructor(
    private materiasService: MateriasService,
    public authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadMaterias();
  }

  loadMaterias(): void {
    this.materiasService.getAll().subscribe({
      next: (res) => {
        if (res.success) this.materias = res.datos;
      },
      error: () => console.error('Error cargando materias'),
    });
  }

  abrirFormNuevo(): void {
    if (!this.authService.canPerform('create_materia')) {
      this.alertService.show('No tienes permisos para crear materias', 'danger');
      return;
    }
    this.editingId = null;
    this.form.reset({ creditos: 1 });
    this.modalOpen = true;
  }

  editar(mat: Materia): void {
    if (!this.authService.canPerform('edit_materia')) {
      this.alertService.show('No tienes permisos para editar materias', 'danger');
      return;
    }
    this.materiasService.getOne(mat.id).subscribe({
      next: (res) => {
        if (res.success && res.datos) {
          const m = res.datos;
          this.editingId = m.id;
          this.form.setValue({
            nombre: m.nombre,
            codigo: m.codigo,
            descripcion: m.descripcion || '',
            creditos: m.creditos,
          });
          this.modalOpen = true;
        }
      },
      error: () => this.alertService.show('Error al cargar la materia', 'danger'),
    });
  }

  eliminar(id: number): void {
    if (!this.authService.canPerform('delete_materia')) {
      this.alertService.show('No tienes permisos para eliminar materias', 'danger');
      return;
    }
    if (!confirm('¿Estás seguro de que deseas eliminar esta materia?')) return;

    this.materiasService.delete(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.alertService.show('Materia eliminada correctamente', 'success');
          this.loadMaterias();
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
      nombre: v.nombre!,
      codigo: v.codigo!,
      descripcion: v.descripcion || '',
      creditos: Number(v.creditos),
    };

    this.saving = true;
    const request = this.editingId
      ? this.materiasService.update(this.editingId, data)
      : this.materiasService.create(data);

    request.subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.alertService.show(
            this.editingId ? 'Registro actualizado correctamente' : 'Registro creado correctamente',
            'success'
          );
          this.modalOpen = false;
          this.loadMaterias();
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
