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
// Menú lateral. No muestra sesión porque el login no es parte del MVP.
export class Shell {}
