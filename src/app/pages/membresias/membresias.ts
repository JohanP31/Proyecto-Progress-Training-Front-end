import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../models/cliente.model';
import { Membresia, TipoMembresia } from '../../models/membresia.model';
import { ClienteService } from '../../services/cliente';
import { MembresiaService } from '../../services/membresia';
import { mensajeError } from '../../utils/mensaje-error';

/** HU-04: consultar el estado de la membresía y renovarla. */
@Component({
  imports: [DecimalPipe, FormsModule],
  selector: 'app-membresias',
  styleUrl: '../mvp.css',
  templateUrl: './membresias.html',
})
export class Membresias implements OnInit {
  private readonly clienteService = inject(ClienteService);
  private readonly membresiaService = inject(MembresiaService);

  readonly clientes = signal<Cliente[]>([]);
  // Membresía actual del cliente elegido (null = no tiene)
  readonly membresia = signal<Membresia | null>(null);
  readonly consultada = signal(false);
  readonly mensaje = signal('');
  readonly error = signal('');
  readonly guardando = signal(false);

  // Nombres para mostrar cada tipo
  readonly tipos: { valor: TipoMembresia; texto: string }[] = [
    { valor: 'mensualidad', texto: 'Mensualidad' },
    { valor: 'ingreso_unico', texto: 'Ingreso único' },
  ];
  readonly metodosPago = ['Efectivo', 'Tarjeta', 'Transferencia'];

  clienteId: number | null = null;
  tipo: TipoMembresia = 'mensualidad';
  metodoPago = 'Efectivo';

  ngOnInit(): void {
    this.clienteService.listar().subscribe({
      next: (clientes) => this.clientes.set(clientes),
      error: (error: HttpErrorResponse) => this.error.set(mensajeError(error)),
    });
  }

  /** Se llama al elegir un cliente en la lista. */
  elegirCliente(id: number | null): void {
    this.clienteId = id;
    this.mensaje.set('');
    this.error.set('');
    this.consultarMembresia();
  }

  consultarMembresia(): void {
    this.membresia.set(null);
    this.consultada.set(false);
    if (this.clienteId === null) {
      return;
    }
    this.membresiaService.consultarActual(this.clienteId).subscribe({
      next: (membresia) => {
        this.membresia.set(membresia);
        this.consultada.set(true);
      },
      error: (error: HttpErrorResponse) => {
        // 404 = el cliente todavía no tiene membresías
        if (error.status !== 404) {
          this.error.set(mensajeError(error));
        }
        this.consultada.set(true);
      },
    });
  }

  renovar(): void {
    if (this.clienteId === null) {
      return;
    }
    this.guardando.set(true);
    this.mensaje.set('');
    this.error.set('');
    this.membresiaService
      .renovar({ cliente_id: this.clienteId, tipo: this.tipo, metodo_pago: this.metodoPago })
      .subscribe({
        next: ({ membresia, pago }) => {
          this.guardando.set(false);
          this.membresia.set(membresia);
          this.mensaje.set(
            `Membresía renovada del ${membresia.fecha_inicio} al ${membresia.fecha_fin}. ` +
              `Pago registrado: $${pago.monto.toLocaleString('es-CO')} (${pago.metodo_pago}).`,
          );
        },
        error: (error: HttpErrorResponse) => {
          this.guardando.set(false);
          this.error.set(mensajeError(error));
        },
      });
  }

  textoTipo(tipo: TipoMembresia): string {
    return this.tipos.find((t) => t.valor === tipo)?.texto ?? tipo;
  }
}
