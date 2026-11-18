import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { InventarioPage } from './pages/inventario/inventario';
import { Productos } from './pages/productos/productos';
import { Maquinas } from './pages/maquinas/maquinas';
import { Usuarios } from './pages/usuarios/usuarios';
import { Vendedores } from './pages/vendedores/vendedores';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'vendedores' },
      { path: 'vendedores', component: Vendedores },
      { path: 'productos', component: Productos },
      { path: 'inventario', component: InventarioPage },
      { path: 'maquinas', component: Maquinas },
      { path: 'usuarios', component: Usuarios },
    ],
  },
  { path: '**', redirectTo: 'vendedores' },
];
