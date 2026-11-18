import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Asistencia } from '../../models/asistencia.model';
import { Usuario } from '../../models/usuario.model';
import { AsistenciaService } from '../../services/asistencia';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-usuarios',
  styleUrl: './usuarios.css',
  templateUrl: './usuarios.html',
})
export class Usuarios implements OnInit, OnDestroy {
  private readonly asistenciaService = inject(AsistenciaService);
  private readonly usuarioService = inject(UsuarioService);
  private timer: ReturnType<typeof setInterval> | null = null;

  readonly empleados = signal<Usuario[]>([]);
  readonly asistencias = signal<Record<number, Asistencia[]>>({});
  readonly cargandoAsistencias = signal<number[]>([]);
  readonly guardandoEmpleados = signal<number[]>([]);
  readonly mensajesPorEmpleado = signal<Record<number, string>>({});
  readonly reloj = signal(Date.now());
  readonly hayTurnoActivo = computed(
    () =>
      Object.values(this.asistencias()).some((registros) =>
        registros.some((registro) => registro.fecha_entrada && !registro.fecha_salida),
      ),
  );
  readonly mensaje = signal('');
  readonly cargando = signal(false);

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  ngOnDestroy(): void {
    this.detenerTemporizador();
  }

  cargarEmpleados(): void {
    this.cargando.set(true);
    this.mensaje.set('');
    this.usuarioService.listarEmpleados().subscribe({
      next: (empleados) => {
        this.empleados.set(empleados);
        this.cargando.set(false);
        for (const empleado of empleados) {
          this.cargarAsistencias(empleado.id);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        this.mensaje.set(this.mensajeError(error));
      },
    });
  }

  cargarAsistencias(empleadoId: number): void {
    this.agregarId(this.cargandoAsistencias, empleadoId);
    this.asistenciaService.listarPorEmpleado(empleadoId).subscribe({
      next: (asistencias) => {
        this.asistencias.update((actuales) => ({ ...actuales, [empleadoId]: asistencias }));
        this.quitarId(this.cargandoAsistencias, empleadoId);
        this.actualizarMensaje(empleadoId, '');
        this.sincronizarTemporizador();
      },
      error: (error: HttpErrorResponse) => {
        this.quitarId(this.cargandoAsistencias, empleadoId);
        this.actualizarMensaje(empleadoId, this.mensajeError(error, empleadoId));
      },
    });
  }

  asistenciaActiva(empleadoId: number): Asistencia | null {
    return (
      this.asistencias()[empleadoId]?.find(
        (asistencia) => asistencia.fecha_entrada && !asistencia.fecha_salida,
      ) ?? null
    );
  }

  asistenciaCargando(empleadoId: number): boolean {
    return (
      this.cargandoAsistencias().includes(empleadoId) ||
      !Object.prototype.hasOwnProperty.call(this.asistencias(), empleadoId)
    );
  }

  empleadoGuardando(empleadoId: number): boolean {
    return this.guardandoEmpleados().includes(empleadoId);
  }

  marcarAsistencia(empleadoId: number): void {
    if (this.empleadoGuardando(empleadoId) || this.asistenciaCargando(empleadoId)) {
      return;
    }

    const tipoRegistro = this.asistenciaActiva(empleadoId) ? 'Salida' : 'Entrada';
    this.agregarId(this.guardandoEmpleados, empleadoId);
    this.actualizarMensaje(empleadoId, '');
    this.asistenciaService
      .registrar({ empleado_id: empleadoId, tipo_registro: tipoRegistro })
      .subscribe({
        next: (asistencia) => {
          this.asistencias.update((actuales) => {
            const registros = actuales[empleadoId] ?? [];
            const actualizados =
              tipoRegistro === 'Entrada'
                ? [asistencia, ...registros]
                : registros.map((item) => (item.id === asistencia.id ? asistencia : item));
            return {
              ...actuales,
              [empleadoId]: actualizados.sort(
              (a, b) =>
                new Date(b.fecha_entrada ?? 0).getTime() -
                new Date(a.fecha_entrada ?? 0).getTime(),
              ),
            };
          });
          this.quitarId(this.guardandoEmpleados, empleadoId);
          this.actualizarMensaje(
            empleadoId,
            tipoRegistro === 'Entrada'
              ? 'Entrada registrada correctamente.'
              : 'Salida registrada correctamente.',
          );
          this.sincronizarTemporizador();
        },
        error: (error: HttpErrorResponse) => {
          this.quitarId(this.guardandoEmpleados, empleadoId);
          this.actualizarMensaje(empleadoId, this.mensajeError(error, empleadoId));
        },
      });
  }

  hora(fecha: string | null): string {
    if (!fecha) {
      return '—';
    }

    return new Date(fecha).toLocaleTimeString('es-CO', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  fecha(fecha: string | null): string {
    if (!fecha) {
      return '—';
    }

    return new Date(fecha).toLocaleDateString('es-CO');
  }

  duracion(asistencia: Asistencia): string {
    if (!asistencia.fecha_entrada) {
      return '—';
    }

    const fin = asistencia.fecha_salida
      ? new Date(asistencia.fecha_salida).getTime()
      : Date.now();
    const segundos = Math.max(
      0,
      Math.floor((fin - new Date(asistencia.fecha_entrada).getTime()) / 1000),
    );
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    return `${horas} h ${minutos.toString().padStart(2, '0')} min`;
  }

  tiempoActivo(asistencia: Asistencia): string {
    this.reloj();
    if (!asistencia.fecha_entrada) {
      return '00:00:00';
    }

    const segundos = Math.max(
      0,
      Math.floor((Date.now() - new Date(asistencia.fecha_entrada).getTime()) / 1000),
    );
    const horas = Math.floor(segundos / 3600).toString().padStart(2, '0');
    const minutos = Math.floor((segundos % 3600) / 60).toString().padStart(2, '0');
    const resto = (segundos % 60).toString().padStart(2, '0');
    return `${horas}:${minutos}:${resto}`;
  }

  private sincronizarTemporizador(): void {
    if (this.hayTurnoActivo() && this.timer === null) {
      this.timer = setInterval(() => this.actualizarTiempoActivo(), 1000);
    } else if (!this.hayTurnoActivo()) {
      this.detenerTemporizador();
      this.reloj.set(Date.now());
    }
  }

  private actualizarTiempoActivo(): void {
    this.reloj.set(Date.now());
  }

  private detenerTemporizador(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private mensajeError(error: HttpErrorResponse, empleadoId?: number): string {
    if (error.status === 0) {
      return 'No hubo conexión con el servidor. Verifica que la API esté encendida.';
    }
    if (error.status === 404) {
      return `No se encontró el usuario o empleado${empleadoId ? ` #${empleadoId}` : ''}. Verifica que exista en el backend.`;
    }
    if (error.status === 409) {
      return error.error?.detail ?? 'No se pudo registrar la salida porque no hay una entrada activa.';
    }
    const detalle = error.error?.detail;
    return typeof detalle === 'string'
      ? detalle
      : `No se pudo completar la solicitud (${error.status}).`;
  }

  private agregarId(lista: typeof this.cargandoAsistencias, id: number): void {
    lista.update((ids) => (ids.includes(id) ? ids : [...ids, id]));
  }

  private quitarId(lista: typeof this.cargandoAsistencias, id: number): void {
    lista.update((ids) => ids.filter((actual) => actual !== id));
  }

  private actualizarMensaje(empleadoId: number, mensaje: string): void {
    this.mensajesPorEmpleado.update((mensajes) => ({
      ...mensajes,
      [empleadoId]: mensaje,
    }));
  }
}
