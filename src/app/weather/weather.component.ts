import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  weatherData: any = [];

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
    this.getWeather();
  }

  getWeather(): void {
    //this.weatherService.getWeatherData().then(weatherData => this.weatherData = weatherData);

    // Retreive posts from the API
    this.weatherService.getAllWeatherData()
      .subscribe( weatherData => {
        this.weatherData = weatherData
      });
  }

}
