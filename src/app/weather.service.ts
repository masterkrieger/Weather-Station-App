import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherService {

  constructor(private http: Http) { }

  // Get all weather data from the API
  getAllWeatherData() {
    return this.http.get('/api/weather').map(res => res.json());
  }

}
