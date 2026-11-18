/** Tipos que sabe crear MembresiaFactory en el backend. */
export type TipoMembresia = 'mensualidad' | 'ingreso_unico';

/** Membresía con su estado calculado por el patrón State. */
export interface Membresia {
  id: number;
  tipo: TipoMembresia;
  fecha_inicio: string;
  fecha_fin: string;
  valor: number;
  cliente_id: number;
  nombre_estado: 'Vigente' | 'Vencida';
}

/** Pago registrado al renovar. */
export interface Pago {
  id: number;
  fecha: string;
  monto: number;
  metodo_pago: string;
  concepto: string;
  membresia_id: number;
}

/** Datos para renovar una membresía (HU-04). */
export interface RenovacionCrear {
  cliente_id: number;
  tipo: TipoMembresia;
  metodo_pago: string;
}

/** Respuesta de la renovación: membresía nueva y su pago. */
export interface RenovacionRespuesta {
  membresia: Membresia;
  pago: Pago;
}
