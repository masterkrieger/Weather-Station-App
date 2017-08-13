import { Component, OnInit } from '@angular/core';
//import {trigger, state, style, animate, transition } from '@angular/animations';

import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  // Initialize data variables
  weatherData: any = [];
  errorMessage: any;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.getNWeather(5);
  }

  getWeather(): void {
    // Retreive posts from the API
    this.weatherService.getAllWeatherData()
      .subscribe(
        weatherData => this.weatherData = weatherData,
        error => this.errorMessage = <any>error
      );
  }

  /*
    Description: Function to retrieve a limited number of data points from service.
    Input: 'limit' - number amount of last data points

    Time-Scale component emits dropdown option value to Weather component.
    Then calls function when dropdown option is selected.
  */
  getNWeather(limit: number): void {
    // Retreive weather data from the API
    this.weatherService.getNWeatherData(limit)
      .subscribe(
        weatherData => this.weatherData = weatherData,
        error => this.errorMessage = <any>error
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
