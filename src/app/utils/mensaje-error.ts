import { HttpErrorResponse } from '@angular/common/http';

/** Convierte un error de la API en un texto para mostrar en pantalla. */
export function mensajeError(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'No hubo conexión con el servidor. Verifica que la API esté encendida.';
  }
  const detalle = error.error?.detail;
  // Errores propios de la API: traen un texto en "detail"
  if (typeof detalle === 'string') {
    return detalle;
  }
  // Errores de validación (422): traen una lista de campos
  if (Array.isArray(detalle)) {
    return detalle
      .map(
        (e: { loc?: unknown[]; msg?: string }) =>
          `${e.loc?.at(-1) ?? 'campo'}: ${e.msg ?? 'inválido'}`,
      )
      .join(' · ');
  }
  return `No se pudo completar la solicitud (${error.status}).`;
}
