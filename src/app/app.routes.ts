import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { Clientes } from './pages/clientes/clientes';
import { IngresoPage } from './pages/ingreso/ingreso';
import { Maquinas } from './pages/maquinas/maquinas';
import { Membresias } from './pages/membresias/membresias';
import { Productos } from './pages/productos/productos';
import { Usuarios } from './pages/usuarios/usuarios';

// Vendedores e Inventario se quitaron del menú: llaman endpoints que no
// existen en el backend. Sus archivos se conservan en pages/.
export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      // La pantalla de inicio es el ingreso (flujo principal del MVP)
      { path: '', pathMatch: 'full', redirectTo: 'ingreso' },
      { path: 'ingreso', component: IngresoPage },
      { path: 'clientes', component: Clientes },
      { path: 'membresias', component: Membresias },
      { path: 'productos', component: Productos },
      { path: 'maquinas', component: Maquinas },
      { path: 'usuarios', component: Usuarios },
    ],
  },
  { path: '**', redirectTo: 'ingreso' },
];
