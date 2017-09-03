import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherService {

  constructor(private http: Http) { }

  // Get all weather data from the API
  getAllWeatherData(): Observable<any[]> {
    return this.http.get('/api/weather')
                    .map(res => res.json())
                    .catch(this.handleError);
  };

  /*
    Description: Function to retrieve a limited number of data points of a specfic dataset.
    Input: 'limit' - number amount of last data points
    Input: 'dataset' - string of weather data units (tempf, tempc, humidity, pressure, or altitude)
  */
  getWeatherData(sensor: string, scale: string): Observable<any[]> {
    return this.http.get('/api/weather/' + sensor + '/' + scale)
                    .map(res => res.json())
                    .catch(this.handleError);
  };

  // Handle Error Response
  private handleError(error: Response | any) {
    // In a real world app, might use a remote loggin infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg); // for demo purposes only
    return Observable.throw(errMsg);
  }


}
