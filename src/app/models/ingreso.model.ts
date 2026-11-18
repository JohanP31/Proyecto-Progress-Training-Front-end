/** Datos para registrar un ingreso (HU-02). */
export interface IngresoCrear {
  cliente_id: number;
  empleado_id: number;
}

/** Ingreso guardado por la API. */
export interface Ingreso {
  id: number;
  fecha_hora: string;
  tipo_ingreso: string;
  cliente_id: number;
  empleado_id: number;
}
