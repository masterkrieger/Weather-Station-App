import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
// import {trigger, state, style, animate, transition } from '@angular/animations';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements AfterViewInit {

  @ViewChild('weatherchart') weatherChartView: ElementRef;

  // amCharts options variable
  public options: any;
  // Initialize data variables
  weatherData: any = [];
  errorMessage: any;
  sensorLabel: any;

  constructor(private weatherService: WeatherService) {}

  ngAfterViewInit(): void {
    // var now = new Date();
    //this.chart = this.AmCharts.makeChart('chartdiv', this.makeOptions(this.weatherData));
    this.options = this.makeOptions(this.weatherData, this.sensorLabel);

    // Updates chart with full weatherData after some time
    setInterval(() => {
      // Update chartdiv
      this.options = this.makeOptions(this.weatherData, this.sensorLabel);
    }, 3000);
  }

  makeOptions(dataProvider, sensorLabel) {
    return {
      "type": "xy",
      "theme": "light",
      "dataDateFormat": "HH:NN DD-MM-YYYY",
      "startDuration": 1.5,
      "chartCursor": {},
      "graphs": [{
        "title": "WeMos-3666",
        "bullet": "diamond",
        "balloon": {
          "adjustBorderColor": true,
          "color": "#000000",
          "cornerRadius": 5,
          "fillColor": "#FFFFFF"
        },
        'balloonText': '[[WeMos-3666timestamp]]<br><b><span style=\'font-size:14px;\'>[[WeMos-3666]]</span></b>',
        "lineAlpha": 1,
        "lineColor": "#655dd1",
        "xField": "WeMos-3666timestamp",
        "yField": "WeMos-3666"
      }, {
        "title": "Thing-1091",
        "bullet": "round",
        'balloonText': '[[Thing-1091timestamp]]<br><b><span style=\'font-size:14px;\'>[[Thing-1091]]</span></b>',
        "lineAlpha": 1,
        "lineColor": "#D1655D",
        "xField": "Thing-1091timestamp",
        "yField": "Thing-1091"
      }],
      "valueAxes": [{
        "id": "v1",
        "axisAlpha": 0,
        "title": sensorLabel,
        "position": "left"
      }, {
        "id": "v2",
        "axisAlpha": 0,
        "position": "bottom",
        "type": "date"
      }],
      "legend": {
        "useGraphSettings": true,
        "align": "left",
      },
      "dataProvider": dataProvider,
      "export": {
        enabled: true
      },
      "creditsPosition": "bottom-right"
    };
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
    // Update the y-axis label
    this.sensorLabel = event.sensorLabel;
    // This must be called when making any changes to the chart
    this.options = this.makeOptions(this.weatherData, this.sensorLabel);
  }
}
