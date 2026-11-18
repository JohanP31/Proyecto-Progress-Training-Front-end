import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Membresia, RenovacionCrear, RenovacionRespuesta } from '../models/membresia.model';

@Injectable({ providedIn: 'root' })
export class MembresiaService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/membresias`;

  /** GET /membresias/cliente/{id}: membresía actual y su estado */
  consultarActual(clienteId: number): Observable<Membresia> {
    return this.http.get<Membresia>(`${this.base}/cliente/${clienteId}`);
  }

  /** POST /membresias/renovar (HU-04) */
  renovar(datos: RenovacionCrear): Observable<RenovacionRespuesta> {
    return this.http.post<RenovacionRespuesta>(`${this.base}/renovar`, datos);
  }
}
