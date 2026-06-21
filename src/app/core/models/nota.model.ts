export interface Nota {
  id: number;
  estudiante_id: number;
  materia_id: number;
  profesor_id: number;
  periodo: number;
  año_lectivo: number;
  nota: number;
  observaciones?: string;
  estudiante_nombre?: string;
  materia_nombre?: string;
  profesor_nombre?: string;
}

export interface NotaFiltros {
  estudiante_id?: string | number;
  materia_id?: string | number;
  periodo?: string | number;
  año_lectivo?: string | number;
}
