export type Rol = 'admin' | 'secretaria' | 'docente' | string;

export interface Usuario {
  id: number;
  username: string;
  rol: Rol;
}

export interface LoginResponseData {
  token: string;
  usuario: Usuario;
}
