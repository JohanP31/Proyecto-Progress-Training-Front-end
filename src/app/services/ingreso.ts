import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ingreso, IngresoCrear } from '../models/ingreso.model';

@Injectable({ providedIn: 'root' })
export class IngresoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/ingresos`;

  /** POST /ingresos (HU-02 y HU-03) */
  registrar(datos: IngresoCrear): Observable<Ingreso> {
    return this.http.post<Ingreso>(this.base, datos);
  }
}
