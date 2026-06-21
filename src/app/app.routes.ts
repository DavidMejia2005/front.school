import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EstudiantesComponent } from './features/estudiantes/estudiantes.component';
import { ProfesoresComponent } from './features/profesores/profesores.component';
import { MateriasComponent } from './features/materias/materias.component';
import { GradosComponent } from './features/grados/grados.component';
import { NotasComponent } from './features/notas/notas.component';
import { MatriculasComponent } from './features/matriculas/matriculas.component';
import { PerfilComponent } from './features/perfil/perfil.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'estudiantes', component: EstudiantesComponent },
      { path: 'profesores', component: ProfesoresComponent },
      { path: 'materias', component: MateriasComponent },
      { path: 'grados', component: GradosComponent },
      { path: 'notas', component: NotasComponent },
      { path: 'matriculas', component: MatriculasComponent },
      { path: 'perfil', component: PerfilComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
