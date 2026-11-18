export type TipoRegistroAsistencia = 'Entrada' | 'Salida';

export interface Asistencia {
  id: number;
  fecha_entrada: string | null;
  fecha_salida: string | null;
  empleado_id: number;
}

export interface AsistenciaCreate {
  empleado_id: number;
  tipo_registro: TipoRegistroAsistencia;
}
