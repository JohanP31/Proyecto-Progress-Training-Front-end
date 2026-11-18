import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { AsistenciaService } from './asistencia';

describe('AsistenciaService', () => {
  let service: AsistenciaService;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/asistencias`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AsistenciaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('consulta el historial por ID de empleado', () => {
    service.listarPorEmpleado(1).subscribe();
    const req = http.expectOne(`${url}/empleado/1`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('registra una entrada o salida con el ID del empleado', () => {
    const datos = { empleado_id: 1, tipo_registro: 'Entrada' as const };
    service.registrar(datos).subscribe();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(datos);
    req.flush({});
  });
});
