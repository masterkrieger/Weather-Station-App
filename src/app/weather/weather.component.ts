import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef } from '@angular/core';
import { NgFor } from "@angular/common";

// ECharts
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

// Weather Service and TimeScale Component
import { WeatherService } from '../weather.service';
import { TimeScaleComponent } from '../time-scale/time-scale.component';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [NgxEchartsModule,TimeScaleComponent,NgFor],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent implements OnInit, OnDestroy {

  //@ViewChild('weatherchart') weatherChartView: ElementRef;

  // ECharts options variable
  public weatherChartOptions: EChartsOption = {};

  // Initialize data variables
  public weatherData: any = [];
  public errorMessage: any;
  public sensorLabel: any;
  public now: Date = new Date();
  public timer: any;

  isBrowser = signal(false);  // a signal to store if platform is browser
  

  constructor(private weatherService: WeatherService) {}

  ngOnInit (): void {
    console.log("Weather component loaded");
    this.now = new Date();
    // Retreive weather data from the API
    //this.getWeather({ sensorValue: 'tempf', scaleValue: new Date(new Date().setMonth(this.now.getMonth() - 1)).toISOString(), sensorLabel: 'Temperature (°F)'})
    //this.getWeatherData('tempf', new Date(new Date().setMonth(this.now.getMonth() - 1)).toISOString(), 'Temp F');
    this.updateOptions(this.weatherData);

    // Updates chart with full weatherData after some time
    if(this.isBrowser()) { // check it where you want to write setTimeout or setInterval   
      setInterval(() => {
        // Update chartdiv
        //this.updateOptions  = this.makeUpdatedOptions(this.weatherData, this.sensorLabel);
        this.updateOptions(this.weatherData);
      }, 1000);
    }
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
  updateOptions(transformedData: { labels: string[], series: any[] }): void {
    if (!transformedData || !transformedData.series || transformedData.series.length === 0) {
      console.error('No data available for the chart.');
      return;
    }

    this.weatherChartOptions = {
      title: {
        text: 'Weather Data',
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: transformedData.series.map(series => series.name),
        align: 'left',
      },      
      xAxis: {
        type: 'time',
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false,
        },
      },
      series: transformedData.series.map(seriesData => ({
        name: seriesData.name,
        type: 'line',
        showSymbol: false,
        data: seriesData.data.map((value:any, index:any) => [transformedData.labels[index], value])
      })),
    };
  }

  transformDataForECharts(data: any[]): { labels: string[], series: any[] } {
    const labels: Set<string> = new Set();
    const seriesMap: Map<string, { name: string, type: string, data: number[] }> = new Map();

    data.forEach(entry => {
      const date = new Date(entry.timestamp);
      const label = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      labels.add(label);

      if (!seriesMap.has(entry.station_id)) {
        seriesMap.set(entry.station_id, { name: entry.station_id, type: 'line', data: [] });
      }
      seriesMap.get(entry.station_id)?.data.push(parseFloat(entry.tempf));
    });

    return { labels: Array.from(labels), series: Array.from(seriesMap.values()) };
  }

  /*
  * Description: Function to retrieve all weather data from service.
  */

  getAllWeather(): void {
    // Retreive posts from the API
    var weathaerServiceData: any[] = [];
    this.weatherService.getAllWeatherData().subscribe({
      next: (weatherData: any[]) => {
        weathaerServiceData = weatherData;
        console.log("Get all weather data/n", weathaerServiceData);
      },
      error: (error: any) => {
        this.errorMessage = error;
      }
    })

    this.weatherData = this.transformDataForECharts(weathaerServiceData);
    // This must be called when making any changes to the chart
    this.updateOptions(this.weatherData);
  }

  /*
  *  Description: Function to retrieve a limited number of data points of a specific dataset from service.
  *  Input: 'limit' - number amount of last data points
  *  Input: 'dataset' - string of weather data units (tempf, tempc, humidity, pressure, or altitude)

  *  Time-Scale component emits a number value and string describing dataset to Weather component.
  *  Then calls function when dropdown option is selected.
  */
  getWeather(event: any): void {
    // console.log(event);
    // Retreive weather data from the API
    var weathaerServiceData: any[] = [];
    this.weatherService.getWeatherDataObservable(event.sensorValue, event.scaleValue).subscribe({
      next: (weatherData: any[]) => {
        weathaerServiceData = weatherData;
        console.log("Get ${event.sensorValue} weather data for the last ${event.scaleValue}/n", weathaerServiceData);
      },
      error: (error: any) => {
        this.errorMessage = error;
      }
    })

    this.weatherData = this.transformDataForECharts(weathaerServiceData);
    console.log(this.weatherData)
    // Update the y-axis label
    this.sensorLabel = event.sensorLabel;
    // This must be called when making any changes to the chart
    this.updateOptions(this.weatherData);
  }
  
  /*
  getWeatherData(sensorValue: string, scaleValue: string, sensorLabel: string): void {

    // Retreive weather data from the API
    this.weatherService.getWeatherDataObservable(sensorValue, scaleValue).subscribe({
      next: (weatherData: any[]) => {
        this.weatherData = weatherData;
      },
      error: (error: any) => {
        this.errorMessage = error;
        console.log(error);
      }
    })

    // Update the y-axis label
    this.sensorLabel = sensorLabel;
    // This must be called when making any changes to the chart
    this.options = this.makeOptions(this.weatherData, this.sensorLabel);
  }  */

}
