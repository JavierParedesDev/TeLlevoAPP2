import { Component, OnInit } from '@angular/core';
import { Viajes } from '../interfaces/viajes';

@Component({
  selector: 'app-pasajero',
  templateUrl: './pasajero.page.html',
  styleUrls: ['./pasajero.page.scss'],
})
export class PasajeroPage implements OnInit {
  viajes: Viajes[]= [];

  constructor() { }

  ngOnInit() {
    this.cargarViajes()
  }
  cargarViajes() {
    const StorageViajes = localStorage.getItem('viajes');
    if (StorageViajes) {
      this.viajes = JSON.parse(StorageViajes);
    } else {
      console.log('No hay viajes disponibles.');
    }
  }

  solicitarViaje(viaje: Viajes) {
    console.log();
    // Aquí puedes manejar la solicitud del viaje
  }

}
