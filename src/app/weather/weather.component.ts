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
    var now = new Date();
  }

  getAllWeather(): void {
    // Retreive posts from the API
    this.weatherService.getAllWeatherData()
      .subscribe(
        weatherData => this.weatherData = weatherData,
        error => this.errorMessage = <any>error
      );
  }

  /*
    Description: Function to retrieve a limited number of data points of a specific dataset from service.
    Input: 'limit' - number amount of last data points
    Input: 'dataset' - string of weather data units (tempf, tempc, humidity, pressure, or altitude)

    Time-Scale component emits a number value and string describing dataset to Weather component.
    Then calls function when dropdown option is selected.
  */
  getWeather(event:any): void {
    console.log(event);
    // Retreive weather data from the API
    this.weatherService.getWeatherData(event.sensorValue, event.scaleValue)
      .subscribe(
        weatherData => this.weatherData = weatherData,
        error => this.errorMessage = <any>error
      );
  }

  /*********************
    Line-Chart settings
  *********************/

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
