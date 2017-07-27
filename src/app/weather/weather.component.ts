import { Component, OnInit } from '@angular/core';
//import {trigger, state, style, animate, transition } from '@angular/animations';

import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  weatherData: any = [];

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.getWeather();
    console.log(this.weatherData);
  }

  getWeather(): void {
    // Retreive posts from the API
    this.weatherService.getAllWeatherData()
      .subscribe(
        weatherData => this.weatherData = weatherData//,
        //error => this.errorMessage = <any>error
      );
  }

  /***
    Line-Chart settings
  ***/

  view: any[] = [900, 400];

  // Options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXaxisLabel = true;
  xAxisLabel = "Date";
  showYaxisLabel = true;
  yAxisLabel = "TempF";

  colorScheme = {
    domain: ['#5aa454', '#a10a28', '#c7b42c', '#aaaaa']
  };

  // line, area
  autoScale = true;

  onSelect(event: any) {
    console.log(event);
  }

}
