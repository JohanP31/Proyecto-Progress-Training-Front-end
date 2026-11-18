import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Asistencia, AsistenciaCreate } from '../models/asistencia.model';

@Injectable({ providedIn: 'root' })
export class AsistenciaService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/asistencias`;

  listarPorEmpleado(empleadoId: number): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(`${this.base}/empleado/${empleadoId}`);
  }

  registrar(datos: AsistenciaCreate): Observable<Asistencia> {
    return this.http.post<Asistencia>(this.base, datos);
  }
}
