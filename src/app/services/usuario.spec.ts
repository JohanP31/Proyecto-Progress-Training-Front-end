import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { UsuarioService } from './usuario';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/usuarios`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UsuarioService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lista empleados con GET /usuarios/empleados', () => {
    service.listarEmpleados().subscribe();
    const req = http.expectOne(`${url}/empleados`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
