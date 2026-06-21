export interface Profesor {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  especialidad?: string;
  activo: boolean;
}

export interface ProfesorFiltros {
  buscar?: string;
  activo?: boolean;
}
