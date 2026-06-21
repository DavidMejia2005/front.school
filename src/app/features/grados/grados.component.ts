import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Grado } from '../../core/models/grado.model';
import { GradosService } from '../../core/services/grados.service';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-grados',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './grados.component.html',
  styleUrl: './grados.component.scss',
})
export class GradosComponent implements OnInit {
  private fb = inject(FormBuilder);

  grados: Grado[] = [];

  modalOpen = false;
  saving = false;
  editingId: number | null = null;

  form = this.fb.group({
    nombre: ['', Validators.required],
    nivel: ['', Validators.required],
    descripcion: [''],
  });

  constructor(
    private gradosService: GradosService,
    public authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadGrados();
  }

  loadGrados(): void {
    this.gradosService.getAll().subscribe({
      next: (res) => {
        if (res.success) this.grados = res.datos;
      },
      error: () => console.error('Error cargando grados'),
    });
  }

  abrirFormNuevo(): void {
    if (!this.authService.canPerform('create_grado')) {
      this.alertService.show('No tienes permisos para crear grados', 'danger');
      return;
    }
    this.editingId = null;
    this.form.reset();
    this.modalOpen = true;
  }

  editar(grado: Grado): void {
    if (!this.authService.canPerform('edit_grado')) {
      this.alertService.show('No tienes permisos para editar grados', 'danger');
      return;
    }
    this.gradosService.getOne(grado.id).subscribe({
      next: (res) => {
        if (res.success && res.datos) {
          const g = res.datos;
          this.editingId = g.id;
          this.form.setValue({
            nombre: g.nombre,
            nivel: g.nivel,
            descripcion: g.descripcion || '',
          });
          this.modalOpen = true;
        }
      },
      error: () => this.alertService.show('Error al cargar el grado', 'danger'),
    });
  }

  eliminar(id: number): void {
    if (!this.authService.canPerform('delete_grado')) {
      this.alertService.show('No tienes permisos para eliminar grados', 'danger');
      return;
    }
    if (!confirm('¿Estás seguro de que deseas eliminar este grado?')) return;

    this.gradosService.delete(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.alertService.show('Grado eliminado correctamente', 'success');
          this.loadGrados();
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
      nivel: v.nivel!,
      descripcion: v.descripcion || '',
    };

    this.saving = true;
    const request = this.editingId
      ? this.gradosService.update(this.editingId, data)
      : this.gradosService.create(data);

    request.subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.alertService.show(
            this.editingId ? 'Registro actualizado correctamente' : 'Registro creado correctamente',
            'success'
          );
          this.modalOpen = false;
          this.loadGrados();
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
