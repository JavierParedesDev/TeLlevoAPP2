import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { Viajes } from '../interfaces/viajes';
import { LoadingController } from '@ionic/angular';

import { MapsService } from '../services/maps.service'; // Servicio creado exclusivamente para el mapa

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
  };
  viajes: Viajes[] = [];
  currentLocation: any;

  constructor(
    private mapsService: MapsService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.cargarViajes()
  }

  async ngAfterViewInit() {
    this.currentLocation = await this.mapsService.getCurrentLocation();

    setTimeout(() => {
      this.initMaps();
    }, 300);
  }

  async initCurrentLocation() {
    try {
      this.currentLocation = await this.mapsService.getCurrentLocation();
      console.log('Geolocalización disponible.', this.currentLocation);
    } catch (error) {
      console.error('Error al obtener la geolocalización:', error);
    }
  }

  async programarViaje() {
    const loading = await this.loadingController.create({
      message: 'Creando dirección...',
    });
    await loading.present();

    const StorageViajes = localStorage.getItem('viajes');
    let viajes: Viajes[] = StorageViajes ? JSON.parse(StorageViajes) : [];

    this.vje.id = Date.now();

    try {
      const location = await this.mapsService.getLatLngFromAddress(this.vje.destino);
      this.vje.lat = location.lat;
      this.vje.lng = location.lng;

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
      this.initMaps();
    } catch (error) {
      console.error('Error al crear la dirección:', error);
    } finally {
      await loading.dismiss();
    }
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
    this.initMaps();
  }

  initMaps() {
    this.viajes.forEach((viaje) => {
      if (viaje.lat !== undefined && viaje.lng !== undefined) {
        const mapId = `map-${viaje.id}`;

        const mapContainer = document.getElementById(mapId);
        if (mapContainer) {
          const map = this.mapsService.initMap(mapId, viaje.lat, viaje.lng);
          this.mapsService.addMarker(map, viaje.lat, viaje.lng);

          if (this.currentLocation) {
            this.mapsService.addMarker(map, this.currentLocation.lat, this.currentLocation.lng);
            this.mapsService.drawRoute(map, this.currentLocation.lat, this.currentLocation.lng, viaje.lat, viaje.lng);
          }
        } else {
          console.warn(`El contenedor del mapa ${mapId} no está disponible.`);
        }
      }
    });
  }

}
