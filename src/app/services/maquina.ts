import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  EstadoMaquina,
  Maquina,
  MaquinaCreate,
  Mantenimiento,
  MantenimientoCreate,
} from '../models/maquina.model';

@Injectable({ providedIn: 'root' })
export class MaquinaService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/maquinas/`;

  listar(): Observable<Maquina[]> {
    return this.http.get<Maquina[]>(this.base);
  }

  crear(datos: MaquinaCreate): Observable<Maquina> {
    return this.http.post<Maquina>(this.base, datos);
  }

  actualizarEstado(id: number, nuevoEstado: EstadoMaquina): Observable<Maquina> {
    return this.http.put<Maquina>(`${this.base}${id}/estado`, null, {
      params: { nuevo_estado: nuevoEstado },
    });
  }

  registrarMantenimiento(
    id: number,
    datos: MantenimientoCreate,
  ): Observable<Mantenimiento> {
    return this.http.post<Mantenimiento>(
      `${this.base}${id}/mantenimientos`,
      datos,
    );
  }
}
