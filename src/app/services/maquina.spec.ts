import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { MaquinaService } from './maquina';

describe('MaquinaService', () => {
  let service: MaquinaService;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/maquinas/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MaquinaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lista máquinas con GET /maquinas/', () => {
    service.listar().subscribe();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('crea máquinas con POST /maquinas/', () => {
    const datos = {
      nombre: 'Prensa de piernas',
      estado: 'Disponible' as const,
      fecha_adquisicion: null,
    };
    service.crear(datos).subscribe();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(datos);
    req.flush({});
  });

  it('actualiza el estado usando el parámetro esperado por la API', () => {
    service.actualizarEstado(7, 'En mantenimiento').subscribe();
    const req = http.expectOne(
      `${url}7/estado?nuevo_estado=En%20mantenimiento`,
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.params.get('nuevo_estado')).toBe('En mantenimiento');
    req.flush({});
  });

  it('registra mantenimientos asociados a una máquina', () => {
    const datos = {
      fecha: '2026-11-18',
      descripcion: 'Revisión preventiva',
      costo: 0,
      estado: 'Pendiente',
    };
    service.registrarMantenimiento(7, datos).subscribe();
    const req = http.expectOne(`${url}7/mantenimientos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(datos);
    req.flush({});
  });
});
