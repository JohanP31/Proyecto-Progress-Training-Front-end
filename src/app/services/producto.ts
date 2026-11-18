import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Producto,
  ProductoCreate,
  VentaCreate,
  VentaResultado,
} from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);
  // El backend define la ruta con "/" al final
  private readonly base = `${environment.apiUrl}/productos/`;

  /** GET /productos/ */
  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.base);
  }

  /** POST /productos/ */
  crear(datos: ProductoCreate): Observable<Producto> {
    return this.http.post<Producto>(this.base, datos);
  }

  /** POST /productos/ventas: descuenta el stock */
  vender(datos: VentaCreate): Observable<VentaResultado> {
    return this.http.post<VentaResultado>(`${this.base}ventas`, datos);
  }
}
