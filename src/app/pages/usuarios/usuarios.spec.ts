import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { Usuarios } from './usuarios';

describe('Usuarios', () => {
  let fixture: ComponentFixture<Usuarios>;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/asistencias`;
  const empleadosUrl = `${environment.apiUrl}/usuarios/empleados`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Usuarios],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Usuarios);
    fixture.detectChanges();
    http.expectOne(empleadosUrl).flush([
      {
        id: 3,
        nombre: 'Torres',
        documento: '1028569',
        telefono: '3215469871',
        correo: 'user2@example.com',
        rol: 'Empleado',
        nivel_acceso: null,
        cargo: 'Entrenador',
        salario: 2000000,
      },
      {
        id: 4,
        nombre: 'Bermudez P',
        documento: '1012365',
        telefono: '3107894451',
        correo: 'user3@example.com',
        rol: 'Empleado',
        nivel_acceso: null,
        cargo: 'Entrenador',
        salario: 2200000,
      },
    ]);
    http.expectOne(`${url}/empleado/3`).flush([]);
    http.expectOne(`${url}/empleado/4`).flush([]);
    await fixture.whenStable();
  });

  afterEach(() => {
    http.verify();
    fixture.componentInstance.ngOnDestroy();
  });

  it('muestra a todos los empleados disponibles para marcar', () => {
    expect(fixture.nativeElement.textContent).toContain('USUARIOS');
    expect(fixture.nativeElement.textContent).toContain('Torres');
    expect(fixture.nativeElement.textContent).toContain('Bermudez P');
    expect(fixture.nativeElement.textContent).toContain('Entrenador');
    expect(fixture.nativeElement.querySelectorAll('.tarjeta-empleado').length).toBe(2);
  });

  it('registra entradas de forma independiente para cada empleado', () => {
    fixture.componentInstance.marcarAsistencia(3);
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      empleado_id: 3,
      tipo_registro: 'Entrada',
    });

    req.flush({
      id: 8,
      empleado_id: 3,
      fecha_entrada: new Date(Date.now() - 120_000).toISOString(),
      fecha_salida: null,
    });

    expect(fixture.componentInstance.asistenciaActiva(3)?.id).toBe(8);
    expect(fixture.componentInstance.asistenciaActiva(4)).toBeNull();
    expect(fixture.componentInstance.tiempoActivo(
      fixture.componentInstance.asistenciaActiva(3)!,
    )).toBe('00:02:00');

    fixture.componentInstance.marcarAsistencia(3);
    const salida = http.expectOne(url);
    expect(salida.request.body).toEqual({
      empleado_id: 3,
      tipo_registro: 'Salida',
    });
    salida.flush({
      id: 8,
      empleado_id: 3,
      fecha_entrada: new Date(Date.now() - 120_000).toISOString(),
      fecha_salida: new Date().toISOString(),
    });

    expect(fixture.componentInstance.asistenciaActiva(3)).toBeNull();
  });
});
