import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shell.html',
  styleUrls: ['./shell.css']
})
export class Shell {
  // Simulación de usuario de sesión actual obtenido del backend / auth
  userSession = 'johanbermudez1140463';

  onLogout(): void {
    // Lógica para cerrar sesión (limpiar token, redirigir al login, etc.)
    console.log('Cerrando sesión...');
  }
}
