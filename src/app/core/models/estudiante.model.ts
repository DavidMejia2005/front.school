export interface Estudiante {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  fecha_nac?: string;
  grado_id: number;
  activo: boolean;
}

export interface EstudianteFiltros {
  buscar?: string;
  grado_id?: string | number;
  activo?: boolean;
}
