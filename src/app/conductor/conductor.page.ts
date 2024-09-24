import { Component, OnInit } from '@angular/core';
import { Viajes } from '../interfaces/viajes';


@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage implements OnInit {

  vje:Viajes={
    id: Date.now(),
    destino: "",
    capacidad: 0,
    costo: 0,
    horaSalida: ""
  }
  viajes: Viajes[] = [];

  constructor() { }

  ngOnInit() {
    this.cargarViajes()
  }
  programarViaje() {
    const StorageViajes = localStorage.getItem('viajes');
    let viajes: Viajes[] = StorageViajes ? JSON.parse(StorageViajes) : [];

    this.vje.id = Date.now();
    
    viajes.push(this.vje);
    localStorage.setItem('viajes', JSON.stringify(viajes));
    console.log('Viaje guardado:', this.vje)

    this.vje = {
      id: Date.now(),
      destino: "",
      capacidad: 0,
      costo: 0,
      horaSalida: ""
    };
    this.cargarViajes();
  }
  cargarViajes() {
    const StorageViajes = localStorage.getItem('viajes');
    if (StorageViajes) {
      this.viajes = JSON.parse(StorageViajes);
    } else {
      console.log('No hay viajes disponibles.');
    }
  }

  eliminarViaje(id: number) {
    const StorageViajes = localStorage.getItem('viajes');
    let viajes: Viajes[] = StorageViajes ? JSON.parse(StorageViajes) : [];
  
    viajes = viajes.filter(viaje => viaje.id !== id);
  
    localStorage.setItem('viajes', JSON.stringify(viajes));
  
    console.log(`Viaje con ID ${id} eliminado.`);
    this.cargarViajes();
  }
  
  

}
