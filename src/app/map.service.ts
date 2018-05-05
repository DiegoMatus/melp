import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


import { environment } from '../environments/environment';
import { GeoJson } from './map';
import * as mapboxgl from 'mapbox-gl';

@Injectable()
export class MapService {

  constructor(private http: HttpClient) {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }


  getPlaces(): Observable<any> {
      return this.http.get('https://s3-us-west-2.amazonaws.com/lgoveabucket/data_melp.json');
  }

}