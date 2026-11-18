export type EstadoMaquina = 'Disponible' | 'En mantenimiento' | 'Dañada';

export interface Mantenimiento {
  id: number;
  fecha: string;
  descripcion: string;
  costo: number;
  estado: string;
  maquina_id: number;
}

export interface Maquina {
  id: number;
  nombre: string;
  estado: EstadoMaquina;
  fecha_adquisicion: string | null;
  mantenimientos: Mantenimiento[];
}

export interface MaquinaCreate {
  nombre: string;
  estado: EstadoMaquina;
  fecha_adquisicion: string | null;
}

export interface MantenimientoCreate {
  fecha: string;
  descripcion: string;
  costo: number;
  estado: string;
}
