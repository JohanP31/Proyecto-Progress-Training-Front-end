import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Producto, ProductoCreate } from '../../models/producto.model';
import { ProductoService } from '../../services/producto';
import { mensajeError } from '../../utils/mensaje-error';

/** Tienda: lista de productos, creación y venta (descuenta stock). */
@Component({
  imports: [DecimalPipe, FormsModule],
  selector: 'app-productos',
  styleUrl: './productos.css',
  templateUrl: './productos.html',
})
export class Productos implements OnInit {
  private readonly productoService = inject(ProductoService);

  readonly filas = signal<Producto[]>([]);
  readonly mensaje = signal('');
  readonly popup = signal<'crear' | 'vender' | null>(null);
  readonly guardando = signal(false);
  readonly errorPopup = signal('');

  formulario: ProductoCreate = this.nuevoFormulario();
  // Producto que se está vendiendo y cantidad
  productoVenta: Producto | null = null;
  cantidad = 1;

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(mensajeExito = ''): void {
    this.productoService.listar().subscribe({
      next: (productos) => {
        this.filas.set(productos);
        this.mensaje.set(mensajeExito);
      },
      error: (error: HttpErrorResponse) => {
        this.filas.set([]);
        this.mensaje.set(mensajeError(error));
      },
    });
  }

  abrirCrear(): void {
    this.formulario = this.nuevoFormulario();
    this.errorPopup.set('');
    this.popup.set('crear');
  }

  abrirVender(producto: Producto): void {
    this.productoVenta = producto;
    this.cantidad = 1;
    this.errorPopup.set('');
    this.popup.set('vender');
  }

  cerrarPopup(): void {
    if (!this.guardando()) {
      this.popup.set(null);
      this.productoVenta = null;
    }
  }

  crear(): void {
    const datos: ProductoCreate = {
      ...this.formulario,
      nombre: this.formulario.nombre.trim(),
      categoria: this.formulario.categoria.trim(),
    };
    this.guardando.set(true);
    this.errorPopup.set('');
    this.productoService.crear(datos).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarPopup();
        this.cargarProductos('Producto creado correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.guardando.set(false);
        this.errorPopup.set(mensajeError(error));
      },
    });
  }

  vender(): void {
    const producto = this.productoVenta;
    if (producto === null) {
      return;
    }
    this.guardando.set(true);
    this.errorPopup.set('');
    this.productoService.vender({ producto_id: producto.id, cantidad: this.cantidad }).subscribe({
      next: (venta) => {
        this.guardando.set(false);
        this.cerrarPopup();
        this.cargarProductos(
          `Venta registrada: ${venta.cantidad_vendida} × ${venta.producto}. ` +
            `Total $${venta.total_pagado.toLocaleString('es-CO')}. ` +
            `Quedan ${venta.stock_restante}.`,
        );
      },
      error: (error: HttpErrorResponse) => {
        // Por ejemplo 400: stock insuficiente
        this.guardando.set(false);
        this.errorPopup.set(mensajeError(error));
      },
    });
  }

  private nuevoFormulario(): ProductoCreate {
    return { nombre: '', categoria: '', precio_unitario: 0, stock: 0 };
  }
}
