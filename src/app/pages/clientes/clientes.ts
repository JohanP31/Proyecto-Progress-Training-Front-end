import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente, ClienteCrear } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente';
import { mensajeError } from '../../utils/mensaje-error';

/** HU-01: lista de clientes y registro de clientes nuevos. */
@Component({
  imports: [FormsModule],
  selector: 'app-clientes',
  styleUrl: '../mvp.css',
  templateUrl: './clientes.html',
})
export class Clientes implements OnInit {
  private readonly clienteService = inject(ClienteService);

  readonly clientes = signal<Cliente[]>([]);
  readonly mensaje = signal('');
  readonly errorFormulario = signal('');
  readonly modalAbierto = signal(false);
  readonly guardando = signal(false);

  formulario: ClienteCrear = this.nuevoCliente();

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(mensajeExito = ''): void {
    this.clienteService.listar().subscribe({
      next: (clientes) => {
        this.clientes.set(clientes);
        this.mensaje.set(mensajeExito);
      },
      error: (error: HttpErrorResponse) => this.mensaje.set(mensajeError(error)),
    });
  }

  abrirModal(): void {
    this.formulario = this.nuevoCliente();
    this.errorFormulario.set('');
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    if (!this.guardando()) {
      this.modalAbierto.set(false);
    }
  }

  registrar(): void {
    // Los campos opcionales vacíos se envían como null
    const datos: ClienteCrear = {
      nombre: this.formulario.nombre.trim(),
      documento: this.formulario.documento.trim(),
      telefono: this.formulario.telefono?.trim() || null,
      fecha_nacimiento: this.formulario.fecha_nacimiento || null,
    };
    this.guardando.set(true);
    this.errorFormulario.set('');
    this.clienteService.registrar(datos).subscribe({
      next: (cliente) => {
        this.guardando.set(false);
        this.cerrarModal();
        this.cargarClientes(`Cliente ${cliente.nombre} registrado correctamente.`);
      },
      error: (error: HttpErrorResponse) => {
        // Por ejemplo 409: documento repetido
        this.guardando.set(false);
        this.errorFormulario.set(mensajeError(error));
      },
    });
  }

  private nuevoCliente(): ClienteCrear {
    return { nombre: '', documento: '', telefono: null, fecha_nacimiento: null };
  }
}
