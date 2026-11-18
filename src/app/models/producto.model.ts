// Coincide con los schemas del backend (app/schemas/producto_schema.py)

/** Venta de un producto. */
export interface VentaProducto {
  id: number;
  fecha: string;
  cantidad: number;
  total: number;
  producto_id: number;
}

/** Producto tal como lo devuelve GET /productos/. */
export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio_unitario: number;
  stock: number;
  ventas: VentaProducto[];
}

/** Datos para crear un producto (POST /productos/). */
export interface ProductoCreate {
  nombre: string;
  categoria: string;
  precio_unitario: number;
  stock: number;
}

/** Datos para vender (POST /productos/ventas). */
export interface VentaCreate {
  producto_id: number;
  cantidad: number;
}

/** Respuesta de la venta. */
export interface VentaResultado {
  mensaje: string;
  venta_id: number;
  producto: string;
  cantidad_vendida: number;
  total_pagado: number;
  stock_restante: number;
}
