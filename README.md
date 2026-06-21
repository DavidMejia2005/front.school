# Colegio — Frontend Angular 18

Migración del frontend original (HTML + JavaScript vanilla + Bootstrap 5) a **Angular 18** con
componentes standalone, formularios reactivos y arquitectura modular.

## 🚀 Cómo ejecutarlo

```bash
npm install
npm start
```

Esto levanta el servidor de desarrollo en **http://localhost:4200**.

> El backend debe estar corriendo en `http://localhost:3000` (igual que antes). Si necesitas
> cambiar la URL de la API, edítala en `src/app/core/config.ts`.

### Build de producción

```bash
npm run build
```

Los archivos compilados quedan en `dist/colegio-frontend/`.

---

## 🔐 Credenciales de prueba

| Usuario     | Contraseña    | Rol         |
|-------------|---------------|-------------|
| admin       | Admin2024*    | admin       |
| secretaria  | Secre2024*    | secretaria  |
| docente1    | Docente2024*  | docente     |

---

## 🗂️ Estructura del proyecto

```
src/app/
├── core/
│   ├── config.ts                  # URL de la API, claves de localStorage
│   ├── models/                    # Interfaces TS (Estudiante, Profesor, Nota, etc.)
│   ├── services/                  # AuthService + un servicio HTTP por recurso
│   ├── guards/auth.guard.ts       # Protege las rutas privadas
│   └── interceptors/auth.interceptor.ts  # Agrega el Bearer token, maneja 401
│
├── shared/
│   ├── components/modal/          # Modal reutilizable (sin dependencia de Bootstrap JS)
│   ├── components/alerts/         # Sistema de alertas (auto-dismiss)
│   └── pipes/                     # statusBadge, notaBadge
│
├── layout/                        # Navbar + sidebar + <router-outlet>
│
└── features/
    ├── login/
    ├── dashboard/
    ├── estudiantes/
    ├── profesores/
    ├── materias/
    ├── grados/
    ├── notas/
    ├── matriculas/
    └── perfil/
```

---

## 🔄 Qué cambió respecto a la versión original

| Antes (vanilla JS)                         | Ahora (Angular 18)                                   |
|---------------------------------------------|-------------------------------------------------------|
| `config.js`, `auth.js`, `api.js`            | `core/config.ts` + `AuthService` + un servicio por recurso (`HttpClient`) |
| `if (!token) ...` repetido en cada fetch    | `authInterceptor` (agrega el header automáticamente) |
| Redirección manual al expirar el token      | `authInterceptor` detecta 401 y redirige a `/login`  |
| `canPerform()` revisado a mano en cada vista| Mismo `canPerform()`, ahora en `AuthService`, usado con `*ngIf` |
| Vistas mostradas/ocultadas con `display`    | Rutas reales con `RouterModule` (`/estudiantes`, `/notas`, etc.) |
| Modal de Bootstrap (`bootstrap.bundle.js`)  | `<app-modal>` — componente Angular puro, sin dependencia de JS de Bootstrap |
| Sidebar *offcanvas* de Bootstrap            | Sidebar con estado de Angular (clase `.sidebar-open`), sin JS externo |
| HTML armado con strings (`innerHTML`)       | Templates de Angular + **Reactive Forms** |
| `showAlert()` con `setTimeout` manual       | `AlertService` (observable) + `<app-alerts>` |
| Sin tipos                                   | Interfaces TypeScript para cada entidad y cada respuesta de la API |

La lógica de negocio (permisos por rol, endpoints, validaciones) es la misma; solo cambió
la forma en que está organizada y renderizada.

### Notas técnicas
- Bootstrap 5 y Bootstrap Icons se cargan por CDN en `src/index.html` (solo CSS — no se
  usa el JS de Bootstrap en ningún componente).
- Las fuentes (Poppins + Inter) también se cargan por CDN.
- Todos los componentes son **standalone** (no hay `NgModule`s).
- El guard y el interceptor usan la sintaxis funcional de Angular 18 (`CanActivateFn`,
  `HttpInterceptorFn`).
