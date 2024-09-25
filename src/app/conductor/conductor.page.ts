import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { Viajes } from '../interfaces/viajes';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { LoadingController } from '@ionic/angular';

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
  currentLocation: any;
  maps: { [key: number]: any } = {};

  constructor(
    private http: HttpClient,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.cargarViajes()
  }

  async ngAfterViewInit() {
    // Inicializar los mapas después de que el DOM esté listo
    await this.getCurrentLocation();
    this.initMaps();
  }

  getLatLngFromAddress(address: string): Promise<any> {
    const apiKey = '5b3ce3597851110001cf62481b2e99cd208841a7b5472176e8ae01d3';
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}`;

    return this.http.get(url).toPromise().then((response: any) => {
      if (response.features && response.features.length > 0) {
        const location = response.features[0].geometry.coordinates;
        return {
          lat: location[1],
          lng: location[0],
        };
      } else {
        return { lat: 0, lng: 0 }; // Devuelve valores predeterminados si no se encuentra nada
      }
    });
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
      const location = await this.getLatLngFromAddress(this.vje.destino);
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


  async getCurrentLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.currentLocation = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude,
    };
    console.log('Geolocalización disponible.', this.currentLocation);
  }

  initMaps() {
    this.destroyMaps();
    this.viajes.forEach((viaje) => {
      if (viaje.lat !== undefined && viaje.lng !== undefined) {
        const mapId = `map-${viaje.id}`;
        const lat = viaje.lat !== undefined ? viaje.lat : 0;
        const lng = viaje.lng !== undefined ? viaje.lng : 0;
        setTimeout(() => {
          const map = L.map(mapId, {
            zoomControl: false, // Deshabilitar el control de zoom
            doubleClickZoom: false, // Deshabilitar zoom con doble clic
            boxZoom: false, // Deshabilitar zoom de caja
            keyboard: false, // Deshabilitar controles de teclado
            touchZoom: false, // Deshabilitar zoom táctil
          }).setView([lat, lng], 12);

          this.maps[viaje.id] = map;

          // Agregar un marcador al mapa solo si lat y lng son números válidos
          if (viaje.lat !== undefined && viaje.lng !== undefined) {
            L.marker([viaje.lat, viaje.lng]).addTo(map);
          }

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
          }).addTo(map);


          if (this.currentLocation) {
            L.marker([this.currentLocation.lat, this.currentLocation.lng], {
              icon: L.icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              }),
            }).addTo(map);

            const routingUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62481b2e99cd208841a7b5472176e8ae01d3&start=${this.currentLocation.lng},${this.currentLocation.lat}&end=${viaje.lng},${viaje.lat}`;

            this.http.get(routingUrl).subscribe((response: any) => {
              console.log('Respuesta de la ruta:', response);
              const coordinates = response.features[0].geometry.coordinates;

              // Convertimos las coordenadas para Leaflet (invirtiendo lng y lat)
              const routeCoordinates = coordinates.map((coord: any) => [coord[1], coord[0]]);

              // Dibujar la línea de la ruta en el mapa
              const routeLine = L.polyline(routeCoordinates, { color: 'blue', weight: 4 }).addTo(map);

              const bounds = L.latLngBounds([
                [this.currentLocation.lat, this.currentLocation.lng],
                [viaje.lat, viaje.lng],
              ]);
              map.fitBounds(bounds);
            });
          }
          setTimeout(() => {
            map.invalidateSize(); // Aseguramos que se ajuste al contenedor después de un pequeño retraso
          });

        });
      }
    });
  }

  destroyMaps() {
    Object.keys(this.maps).forEach((key: string) => {
      const map = this.maps[parseInt(key, 10)]; // Convertir la clave a número
      if (map) {
        map.remove(); // Elimina el mapa del DOM
      }
    });
    this.maps = {}; // Limpia el objeto de mapas
  }
}
