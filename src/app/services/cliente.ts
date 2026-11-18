import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cliente, ClienteCrear } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/clientes`;

  /** GET /clientes */
  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.base);
  }

  /** POST /clientes (HU-01) */
  registrar(datos: ClienteCrear): Observable<Cliente> {
    return this.http.post<Cliente>(this.base, datos);
  }
}
