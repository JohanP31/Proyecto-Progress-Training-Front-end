import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { Maquinas } from './maquinas';

describe('Maquinas', () => {
  let fixture: ComponentFixture<Maquinas>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Maquinas],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Maquinas);
    fixture.detectChanges();
    http.expectOne(`${environment.apiUrl}/maquinas/`).flush([]);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('muestra la interfaz de máquinas y el formulario de creación', () => {
    expect(fixture.nativeElement.textContent).toContain('Máquinas');
    expect(fixture.nativeElement.textContent).toContain('Añadir máquina');

    fixture.componentInstance.abrirCrear();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Añadir nueva máquina');
  });
});
