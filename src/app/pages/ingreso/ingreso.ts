import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../models/cliente.model';
import { Ingreso } from '../../models/ingreso.model';
import { Usuario } from '../../models/usuario.model';
import { ClienteService } from '../../services/cliente';
import { IngresoService } from '../../services/ingreso';
import { UsuarioService } from '../../services/usuario';
import { mensajeError } from '../../utils/mensaje-error';

/** HU-02 y HU-03: registrar el ingreso o mostrar que está bloqueado. */
@Component({
  imports: [DatePipe, FormsModule],
  selector: 'app-ingreso',
  styleUrl: '../mvp.css',
  templateUrl: './ingreso.html',
})
export class IngresoPage implements OnInit {
  private readonly clienteService = inject(ClienteService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly ingresoService = inject(IngresoService);

  readonly clientes = signal<Cliente[]>([]);
  readonly empleados = signal<Usuario[]>([]);
  readonly error = signal('');
  readonly registrando = signal(false);
  // Resultado del último intento
  readonly permitido = signal<Ingreso | null>(null);
  readonly bloqueado = signal('');

  clienteId: number | null = null;
  empleadoId: number | null = null;

  ngOnInit(): void {
    this.clienteService.listar().subscribe({
      next: (clientes) => this.clientes.set(clientes),
      error: (error: HttpErrorResponse) => this.error.set(mensajeError(error)),
    });
    this.usuarioService.listarEmpleados().subscribe({
      next: (empleados) => this.empleados.set(empleados),
      error: (error: HttpErrorResponse) => this.error.set(mensajeError(error)),
    });
  }

  registrar(): void {
    if (this.clienteId === null || this.empleadoId === null) {
      return;
    }
    this.registrando.set(true);
    this.error.set('');
    this.permitido.set(null);
    this.bloqueado.set('');
    this.ingresoService
      .registrar({ cliente_id: this.clienteId, empleado_id: this.empleadoId })
      .subscribe({
        next: (ingreso) => {
          this.registrando.set(false);
          this.permitido.set(ingreso);
        },
        error: (error: HttpErrorResponse) => {
          this.registrando.set(false);
          // 403 = HU-03: membresía vencida o sin membresía
          if (error.status === 403) {
            this.bloqueado.set(mensajeError(error));
          } else {
            this.error.set(mensajeError(error));
          }
        },
      });
  }

  nombreCliente(id: number): string {
    return this.clientes().find((c) => c.id === id)?.nombre ?? `Cliente ${id}`;
  }
}
