import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError  } from 'rxjs';
import { catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private httpClient : HttpClient) {}

  // Get all weather data from the API
  getAllWeatherData(): Observable<any[]> {
    return this.httpClient.get<any[]>('/api/weather')
    .pipe(
      map(response => response), // This is technically optional since HttpClient does this automatically.
      catchError(this.handleError)
    );
  };

  getWeatherData(sensor: string, scale: string) {
    console.log(sensor, scale);
    return this.httpClient.get('/api/weather/sensor?sensor=' + sensor + '&timeScale=' + scale).pipe(
      map(response => response), // This is technically optional since HttpClient does this automatically.
      catchError(this.handleError)
    );
  };

  /*
    Description: Function to retrieve a limited number of data points of a specfic dataset.
    Input: 'limit' - number amount of last data points
    Input: 'dataset' - string of weather data units (tempf, tempc, humidity, pressure, or altitude)
  */
  getWeatherDataObservable(sensor: string, scale: string): Observable<any[]> {
    return this.httpClient.get<any[]>('/api/weather/sensor?sensor=' + sensor + '&timeScale=' + scale)
    .pipe(
      map(response => response), // This is technically optional since HttpClient does this automatically.
      catchError(this.handleError)
    );
  };

  // Handle Error Response
  private handleError(error: HttpErrorResponse): Observable<never> {
    // In a real world app, might use a remote loggin infrastructure
    let errMsg: string;
    if (error.error instanceof ErrorEvent) {
      const body = error.error.message || '';
      const err = body || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg); // for demo purposes only
    return throwError(()  => new Error(errMsg));
  }
}
