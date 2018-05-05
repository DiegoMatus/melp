import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class RestaurantService {

	restaurants: any[];

  	constructor(private http: HttpClient) { }

  	getRestaurants(): Observable<any> {
      return this.http.get('https://s3-us-west-2.amazonaws.com/lgoveabucket/data_melp.json');
  	}

}
