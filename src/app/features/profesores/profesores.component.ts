import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Profesor } from '../../core/models/profesor.model';
import { ProfesoresService } from '../../core/services/profesores.service';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { StatusBadgePipe } from '../../shared/pipes/status-badge.pipe';

@Component({
  selector: 'app-profesores',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, StatusBadgePipe],
  templateUrl: './profesores.component.html',
  styleUrl: './profesores.component.scss',
})
export class ProfesoresComponent implements OnInit {
  private fb = inject(FormBuilder);

  profesores: Profesor[] = [];
  searchTerm = '';

  modalOpen = false;
  saving = false;
  editingId: number | null = null;

  form = this.fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: [''],
    especialidad: [''],
  });

  constructor(
    private profesoresService: ProfesoresService,
    public authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadProfesores();
  }

  loadProfesores(): void {
    this.profesoresService.getAll({ buscar: this.searchTerm }).subscribe({
      next: (res) => {
        if (res.success) this.profesores = res.datos;
      },
      error: () => console.error('Error cargando profesores'),
    });
  }

  abrirFormNuevo(): void {
    if (!this.authService.canPerform('create_profesor')) {
      this.alertService.show('No tienes permisos para crear profesores', 'danger');
      return;
    }
    this.editingId = null;
    this.form.reset();
    this.modalOpen = true;
  }

  editar(prof: Profesor): void {
    if (!this.authService.canPerform('edit_profesor')) {
      this.alertService.show('No tienes permisos para editar profesores', 'danger');
      return;
    }
    this.profesoresService.getOne(prof.id).subscribe({
      next: (res) => {
        if (res.success && res.datos) {
          const p = res.datos;
          this.editingId = p.id;
          this.form.setValue({
            nombres: p.nombres,
            apellidos: p.apellidos,
            email: p.email,
            telefono: p.telefono || '',
            especialidad: p.especialidad || '',
          });
          this.modalOpen = true;
        }
      },
      error: () => this.alertService.show('Error al cargar el profesor', 'danger'),
    });
  }

  eliminar(id: number): void {
    if (!this.authService.canPerform('delete_profesor')) {
      this.alertService.show('No tienes permisos para eliminar profesores', 'danger');
      return;
    }
    if (!confirm('¿Estás seguro de que deseas eliminar este profesor?')) return;

    this.profesoresService.delete(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.alertService.show('Profesor eliminado correctamente', 'success');
          this.loadProfesores();
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
      especialidad: v.especialidad || '',
    };

    this.saving = true;
    const request = this.editingId
      ? this.profesoresService.update(this.editingId, data)
      : this.profesoresService.create(data);

    request.subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.alertService.show(
            this.editingId ? 'Registro actualizado correctamente' : 'Registro creado correctamente',
            'success'
          );
          this.modalOpen = false;
          this.loadProfesores();
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
