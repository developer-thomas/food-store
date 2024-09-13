import { Injectable } from '@angular/core';
import { LatLngLiteral } from 'leaflet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor() {}

  getCurrentLocation(): Observable<LatLngLiteral> {
    /* não preciso que o valor fique armazenado nem que haja multiplos assinantes
     portanto não utilizarei um behaviorSubject */
    return new Observable((observer) => {
      if (!window.navigator.geolocation) return;

      return window.navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
}
