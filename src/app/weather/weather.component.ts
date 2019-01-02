import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
// import {trigger, state, style, animate, transition } from '@angular/animations';

import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements AfterViewInit {

  @ViewChild('weatherchart') weatherChartView: ElementRef;

  // Initialize data variables
  weatherData: any = [];
  errorMessage: any;

  weatherChartViewHeight = 300;
  weatherChartViewWidth = 900;
  view: any[] = [this.weatherChartViewWidth, this.weatherChartViewHeight];
  showLegend = true;
  /*********************
    Line-Chart settings
  *********************/

  // view: any[] = [900, 400];
  // view: any[] = [ window.innerWidth, 480 ];

  // Options
  showXAxis = true;
  showYAxis = true;
  gradient = false;

  showXAxisLabel = true;
  xAxisLabel = 'Date';
  showYAxisLabel = true;
  yAxisLabel = this.weatherData.scaleValue;
  animations = false;
  timeline = true;

  colorScheme = {
    domain: ['#5aa454', '#a10a28', '#c7b42c', '#aaaaa']
  };

  // line, area
  autoScale = true;

  constructor(private weatherService: WeatherService) {}

  ngAfterViewInit(): void {
    // var now = new Date();
    this.weatherChartViewWidth = this.getWeatherChartViewSize();

    /*
      Workaround to fix "ExpressionChangedAfterItHasBeenCheckedError:
      Expression has changed after it was checked"
    */
    setTimeout(_ => this.view = [ this.weatherChartViewWidth, this.weatherChartViewHeight ] )

    if (this.weatherChartViewWidth <= 480) {
      this.showLegend = false;
    }
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
  getWeather(event: any): void {
    // console.log(event);
    // Retreive weather data from the API
    this.weatherService.getWeatherData(event.sensorValue, event.scaleValue)
      .subscribe(
        weatherData => this.weatherData = weatherData,
        error => this.errorMessage = <any>error
      );
  }

  getWeatherChartViewSize(): any {
    return this.weatherChartView.nativeElement.offsetWidth;
  }

  onResize(event: any) { 
    // console.log(this.getWeatherChartViewSize());
    this.view = [ this.getWeatherChartViewSize(), this.weatherChartViewHeight ];
  }

  onSelect(event: any) {
    // console.log(event);
  }

}
