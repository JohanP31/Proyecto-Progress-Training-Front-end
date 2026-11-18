import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { ProductoService } from './producto';

describe('ProductoService', () => {
  let service: ProductoService;
  let http: HttpTestingController;
  // El backend define la ruta con "/" al final
  const url = `${environment.apiUrl}/productos/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lista con GET /productos/', () => {
    service.listar().subscribe();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('crea con POST /productos/', () => {
    const datos = { nombre: 'Whey', categoria: 'Proteína', precio_unitario: 120000, stock: 5 };
    service.crear(datos).subscribe();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(datos);
    req.flush({});
  });

  it('vende con POST /productos/ventas', () => {
    service.vender({ producto_id: 3, cantidad: 2 }).subscribe();
    const req = http.expectOne(`${url}ventas`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ producto_id: 3, cantidad: 2 });
    req.flush({});
  });
});
