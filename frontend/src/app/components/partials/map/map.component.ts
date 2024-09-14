import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import {
  icon,
  LatLng,
  LatLngExpression,
  LatLngTuple,
  LeafletMouseEvent,
  Map,
  map,
  marker,
  Marker,
  tileLayer,
} from 'leaflet';
import { LocationService } from 'src/app/services/location.service';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnChanges {
  private readonly MARKER_ZOOM_LEVEL = 16;
  private readonly DEFAULT_LATLNG: LatLngTuple = [13.74, 21.62];
  private readonly MARKER_ICON = icon({
    iconUrl:
      'https://res.cloudinary.com/foodmine/image/upload/v1638842791/map/marker_kbua9q.png',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });

  @Input() order!: Order;
  @Input() mapIsReadonly: boolean = false;

  @ViewChild('map', { static: true }) mapRef!: ElementRef;

  map!: Map;
  currentMarker!: Marker;

  constructor(private locationService: LocationService) {}

  ngOnChanges() {
    if (!this.order) return;
    this.initializeMap();

    if (this.mapIsReadonly && this.addressLatLng) {
      this.showLocationOnReadonlyMode();
    }
  }

  showLocationOnReadonlyMode() {
    const mapHandler = this.map;
    this.setMarker(this.addressLatLng);
    mapHandler.setView(this.addressLatLng, this.MARKER_ZOOM_LEVEL);

    mapHandler.dragging.disable;
    mapHandler.touchZoom.disable();
    mapHandler.doubleClickZoom.disable();
    mapHandler.scrollWheelZoom.disable();
    mapHandler.boxZoom.disable();
    mapHandler.keyboard.disable();
    mapHandler.off('click');
    mapHandler.tap?.disable();
    this.currentMarker.dragging?.disable();
  }

  initializeMap() {
    if (this.map) return;

    this.map = map(this.mapRef.nativeElement, {
      attributionControl: false,
    }).setView(this.DEFAULT_LATLNG, 1);

    tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);

    this.map.on('click', (ev: LeafletMouseEvent) => {
      this.setMarker(ev.latlng);
    });
  }

  findMyLocation() {
    this.locationService.getCurrentLocation().subscribe({
      next: (latLgn) => {
        this.map.setView(latLgn, this.MARKER_ZOOM_LEVEL);
        this.setMarker(latLgn);
      },
    });
  }

  setMarker(latLng: LatLngExpression) {
    // por se tratar de um setter posso definir seu valor por atribuição
    this.addressLatLng = latLng as LatLng;
    if (this.currentMarker) {
      this.currentMarker.setLatLng(latLng);
      return;
    }

    this.currentMarker = marker(latLng, {
      draggable: true,
      icon: this.MARKER_ICON,
    }).addTo(this.map);

    this.currentMarker.on('dragend', () => {
      this.addressLatLng = this.currentMarker.getLatLng();
    });
  }

  // mongodb não aceita mais que 8 caracteres de floating points
  // então estou deixando eles com o máximo de 8 para mandar para o backend
  set addressLatLng(latLng: LatLng) {
    if (!latLng.lat.toFixed) return;

    latLng.lat = parseFloat(latLng.lat.toFixed(8));
    latLng.lng = parseFloat(latLng.lng.toFixed(8));

    this.order.addressLatLng = latLng;
  }

  get addressLatLng() {
    return this.order.addressLatLng!;
  }
}
