/** Cliente tal como lo devuelve la API (HU-01). */
export interface Cliente {
  id: number;
  nombre: string;
  documento: string;
  telefono: string | null;
  fecha_nacimiento: string | null;
  estado: string;
}

/** Datos para registrar un cliente. */
export interface ClienteCrear {
  nombre: string;
  documento: string;
  telefono: string | null;
  fecha_nacimiento: string | null;
}
