import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherService {

  constructor(private http: Http) { }

  // Get all weather data from the API
  getAllWeatherData() {//: Observable<any[]> {
    return this.http.get('/api/weather')
                    .map(res => res.json());
                    //.catch(this.handleError);
  };

  /*
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
  */

}
