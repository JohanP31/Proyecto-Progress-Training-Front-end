export interface Usuario {
  id: number;
  nombre: string;
  documento: string;
  telefono: string | null;
  correo: string;
  rol: string;
  nivel_acceso: string | null;
  cargo: string | null;
  salario: number | null;
}
