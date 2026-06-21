import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  loading = false;

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertService.show('Por favor completa todos los campos', 'danger');
      return;
    }

    const { username, password } = this.form.value;
    this.loading = true;

    this.authService.login(username!, password!).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.alertService.show(`¡Bienvenido ${res.datos.usuario.username}!`, 'success');
          this.router.navigate(['/dashboard']);
        } else {
          this.alertService.show(res.mensaje || 'Error en la autenticación', 'danger');
        }
      },
      error: () => {
        this.loading = false;
        this.alertService.show('Error de conexión con el servidor', 'danger');
      },
    });
  }
}
