export type EstadoMatricula = 'activa' | 'pausada' | 'finalizada';

export interface Matricula {
  id: number;
  estudiante_id: number;
  grado_id: number;
  año_lectivo: number;
  estado: EstadoMatricula;
  fecha_matricula: string;
  estudiante_nombre?: string;
  grado_nombre?: string;
}

export interface MatriculaFiltros {
  año_lectivo?: string | number;
  grado_id?: string | number;
  estado?: string;
}
