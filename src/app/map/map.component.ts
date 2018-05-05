import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from '../map.service';
import { GeoJson, FeatureCollection, Place } from '../map';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [ MapService ],
})
export class MapComponent implements OnInit{

  /// settings
  map: mapboxgl.Map;
  style = 'mapbox://styles/diego-matus-dflabs/cjgr8g0fq000j2rnsez5cj41r';
  lat = 37.75;
  lng = -122.41;
  message = 'Hello World!';

  el = document.createElement('div');
  el.addClass('marker');
  current_marker = new mapboxgl.Marker(this.el);

  // data
  source: any;
  places: any;
  places_items: any;

  constructor(private mapService: MapService) {
  }

  ngOnInit() {
	this.places = this.mapService.getPlaces();
	this.initializeMap()
  }

  private initializeMap() {
	/// location
	if (navigator.geolocation) {
	   navigator.geolocation.getCurrentPosition(position => {
		this.lat = position.coords.latitude;
		this.lng = position.coords.longitude;
		this.map.flyTo({
		  center: [this.lng, this.lat]
		})
	  });
	}

	this.buildMap()

  }

  buildMap() {
	this.map = new mapboxgl.Map({
	  container: 'map',
	  style: this.style,
	  zoom: 13,
	  center: [this.lng, this.lat]
	});


	/// Map controls
	this.map.addControl(new mapboxgl.NavigationControl());


	/// Add realtime firebase data on map load
	this.map.on('load', (event) => {

	  /// register source
	  this.map.addSource('firebase', {
		 type: 'geojson',
		 data: {
		   type: 'FeatureCollection',
		   features: []
		 }
	  });

	  /// get source
	  this.source = this.map.getSource('firebase')

	  /// subscribe to realtime database and set data source
	  this.places.subscribe(places => {
		  this.places_items = places;
	  	  let data = this.parseToGeoJson(places);
		  data = new FeatureCollection(data)
		  console.log(data);
		  this.source.setData(data)
	  })

	  /// create map layers with realtime data
	  this.map.addLayer({
		id: 'firebase',
		source: 'firebase',
		type: 'symbol',
		layout: {
		  'text-field': '{message}',
		  'text-size': 24,
		  'text-transform': 'uppercase',
		  'icon-image': 'rocket-15',
		  'text-offset': [0, 1.5]
		},
		paint: {
		  'text-color': '#f16624',
		  'text-halo-color': '#fff',
		  'text-halo-width': 2
		}
	  })

	})

  }


  /// Helpers
	parseToGeoJson(places: any) {
		places = places.map(place => {
			return new GeoJson(place.address.location);
		});
		return places;
	}

	flyTo(data: Place) {
		this.map.flyTo({
		  center: data.address.location
		})
		this.addMarker(data.address.location);
	}

	orderBy(property) {
		console.log(this.places_items);
		this.places_items = this.places_items.sort((a, b) => {
			return (a[property] > b[property]) ? 1 : ((b[property] > a[property]) ? -1 : 0);
		});
	}

	addMarker(coordinates){
	  this.current_marker
	  .setLngLat(coordinates)
	  .addTo(this.map);
	}
}
