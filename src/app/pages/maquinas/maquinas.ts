import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstadoMaquina, Maquina, MaquinaCreate, MantenimientoCreate } from '../../models/maquina.model';
import { MaquinaService } from '../../services/maquina';

@Component({
  imports: [DecimalPipe, FormsModule],
  selector: 'app-maquinas',
  styleUrl: './maquinas.css',
  templateUrl: './maquinas.html',
})
export class Maquinas implements OnInit {
  private readonly maquinaService = inject(MaquinaService);

  readonly maquinas = signal<Maquina[]>([]);
  readonly mensaje = signal('');
  readonly errorFormulario = signal('');
  readonly modal = signal<'crear' | 'mantenimiento' | null>(null);
  readonly guardando = signal(false);
  readonly actualizandoId = signal<number | null>(null);
  readonly estados: EstadoMaquina[] = ['Disponible', 'En mantenimiento', 'Dañada'];

  maquinaSeleccionada: Maquina | null = null;
  formularioMaquina: MaquinaCreate = this.nuevaMaquina();
  formularioMantenimiento: MantenimientoCreate = this.nuevoMantenimiento();

  ngOnInit(): void {
    this.cargarMaquinas();
  }

  cargarMaquinas(mensajeExito = ''): void {
    this.maquinaService.listar().subscribe({
      next: (maquinas) => {
        this.maquinas.set(maquinas);
        this.mensaje.set(mensajeExito);
      },
      error: (error: HttpErrorResponse) => {
        this.maquinas.set([]);
        this.mensaje.set(this.mensajeError(error));
      },
    });
  }

  maquinasPorEstado(estado: EstadoMaquina): Maquina[] {
    return this.maquinas().filter((maquina) => maquina.estado === estado);
  }

  abrirCrear(): void {
    this.formularioMaquina = this.nuevaMaquina();
    this.errorFormulario.set('');
    this.modal.set('crear');
  }

  abrirMantenimiento(maquina: Maquina): void {
    this.maquinaSeleccionada = maquina;
    this.formularioMantenimiento = this.nuevoMantenimiento();
    this.errorFormulario.set('');
    this.modal.set('mantenimiento');
  }

  cerrarModal(): void {
    if (!this.guardando()) {
      this.modal.set(null);
      this.maquinaSeleccionada = null;
    }
  }

  crearMaquina(): void {
    const datos: MaquinaCreate = {
      ...this.formularioMaquina,
      nombre: this.formularioMaquina.nombre.trim(),
      fecha_adquisicion: this.formularioMaquina.fecha_adquisicion || null,
    };
    this.guardando.set(true);
    this.errorFormulario.set('');
    this.maquinaService.crear(datos).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarModal();
        this.cargarMaquinas('Máquina creada correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.guardando.set(false);
        this.errorFormulario.set(this.mensajeError(error));
      },
    });
  }

  actualizarEstado(maquina: Maquina, estado: EstadoMaquina): void {
    if (maquina.estado === estado || this.actualizandoId() !== null) {
      return;
    }

    this.actualizandoId.set(maquina.id);
    this.mensaje.set('');
    this.maquinaService.actualizarEstado(maquina.id, estado).subscribe({
      next: (actualizada) => {
        this.maquinas.update((maquinas) =>
          maquinas.map((item) => (item.id === actualizada.id ? actualizada : item)),
        );
        this.actualizandoId.set(null);
        this.mensaje.set('Estado actualizado correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.actualizandoId.set(null);
        this.maquinas.update((maquinas) =>
          maquinas.map((item) => (item.id === maquina.id ? { ...item } : item)),
        );
        this.mensaje.set(this.mensajeError(error));
      },
    });
  }

  registrarMantenimiento(): void {
    const maquina = this.maquinaSeleccionada;
    if (maquina === null) {
      this.errorFormulario.set('Selecciona una máquina para registrar el mantenimiento.');
      return;
    }

    const datos: MantenimientoCreate = {
      ...this.formularioMantenimiento,
      descripcion: this.formularioMantenimiento.descripcion.trim(),
      estado: this.formularioMantenimiento.estado.trim(),
    };
    this.guardando.set(true);
    this.errorFormulario.set('');
    this.maquinaService.registrarMantenimiento(maquina.id, datos).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarModal();
        this.cargarMaquinas('Mantenimiento registrado correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.guardando.set(false);
        this.errorFormulario.set(this.mensajeError(error));
      },
    });
  }

  private nuevaMaquina(): MaquinaCreate {
    return {
      nombre: '',
      estado: 'Disponible',
      fecha_adquisicion: null,
    };
  }

  private nuevoMantenimiento(): MantenimientoCreate {
    const hoy = new Date();
    const fecha = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60_000)
      .toISOString()
      .slice(0, 10);
    return {
      fecha,
      descripcion: '',
      costo: 0,
      estado: 'Pendiente',
    };
  }

  private mensajeError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No hubo conexión con el servidor. Verifica que la API esté encendida.';
    }
    const detalle = error.error?.detail;
    if (typeof detalle === 'string') {
      return detalle;
    }
    if (Array.isArray(detalle)) {
      return detalle
        .map(
          (e: { loc?: unknown[]; msg?: string }) =>
            `${e.loc?.at(-1) ?? 'campo'}: ${e.msg ?? 'inválido'}`,
        )
        .join(' · ');
    }
    return `No se pudo completar la solicitud (${error.status}).`;
  }
}
