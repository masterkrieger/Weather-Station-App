import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef } from '@angular/core';
import { NgFor, NgIf } from "@angular/common";

// ECharts
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

// Weather Service and TimeScale Component
import { WeatherService } from '../weather.service';
import { TimeScaleComponent } from '../time-scale/time-scale.component';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [NgxEchartsModule, TimeScaleComponent, NgFor, NgIf],
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
  public sensor: any;
  public sensorLabel: any;
  public now: Date = new Date();
  public timer: any;

  isBrowser = signal(false);  // a signal to store if platform is browser
  

  constructor(private weatherService: WeatherService) {}

  ngOnInit (): void {
    console.log("Weather component loaded");
    this.now = new Date();
    // Retreive weather data from the API
    this.updateOptions(this.weatherData);

    // Updates chart with full weatherData after some time
    if(this.isBrowser()) { // check it where you want to write setTimeout or setInterval   
      setInterval(() => {
        // Update chartdiv
        this.updateOptions(this.weatherData);
      }, 1000);
    }
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  updateOptions(weatherData: any[]): void {
    // Extract all y-axis values from the series data
    const allValues = weatherData.flatMap(series => series.data.map((d: [number, number]) => d[1]));

    // Calculate the min and max values
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    const stationIds = weatherData.map((series: any) => series.name);

    // Define a color palette
    const colorPalette = ['#5470C6', '#91CC75', '#EE6666', '#73C0DE', '#FAC858', '#9A60B4', '#EA7CCC'];

    this.weatherChartOptions = {
      title: {
        //text: 'Weather Data',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        }
      },
      legend: {
        data: stationIds,
        align: 'left',
      },
      xAxis: {
        name: 'Date',
        type: 'time',
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: function (value: number) {
            const date = new Date(value);
            const hours = date.getHours();
            const minutes = date.getMinutes();
  
            if (hours === 0 && minutes === 0) {
              return date.toLocaleDateString(); // Show date at midnight
            } else if (minutes === 0) {
              return `${hours}:00`; // Show hour at the start of each hour
            }
            return ''; // Hide other labels
          },
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        min: minValue,
        max: maxValue,
        splitLine: {
          show: true,  // Show major grid lines
          lineStyle: {
            type: 'solid'
          }
        },
        minorSplitLine: {
          show: true,  // Show minor grid lines
          lineStyle: {
            type: 'dashed'
          }
        },
        name: this.sensorLabel,     // Label for the y-axis
        nameLocation: 'middle',     // Position the label in the middle of the axis
        nameGap: 30                 // Gap between the label and the axis
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100
        }
      ],
      series: weatherData.map((series, index) => ({
        ...series,
        itemStyle: {
          color: colorPalette[index % colorPalette.length]
        }
      })),
    };
  }

  processWeatherData(data: any[], sensorValue: string): any {
    const processedData: { [key: string]: { [key: string]: number } } = {};

    data.forEach(item => {
      const { station_id, timestamp, tempf, dewptf } = item;
      const value = parseFloat(parseFloat(item[sensorValue]).toFixed(2)); // Dynamically handle any sensor type to 2 decimal places.
  
      if (!processedData[station_id]) {
        processedData[station_id] = {};
      }
  
      processedData[station_id][timestamp] = value;
    });
  
    // Convert to ECharts format
    const series: any[] = [];
  
    for (const [stationId, timestamps] of Object.entries(processedData)) {
      series.push({
        name: stationId,
        type: 'line',
        showSymbol: false,  // Hide data points
        data: Object.keys(timestamps).map(ts => [new Date(ts).getTime(), timestamps[ts]]) // Convert timestamps to [time, value]
      });
    }
  
    return series;
  }

  /*
  *  Description: Function to retrieve a limited number of data points of a specific dataset from service.
  *  Input: 'event' - contains sensorValue (tempf, tempc, humidity, pressure, or altitude) and scaleValue
  *  Calls updateOptions to update chartOptions and transforms API data into weatherData
  */
  getWeather(event: any): void {
    // Retreive weather data from the API
    this.weatherService.getWeatherDataObservable(event.sensorValue, event.scaleValue).subscribe({
      next: (weatherData: any[]) => {
        this.weatherData = this.processWeatherData(weatherData, event.sensorValue);
        //console.log(`Get ${event.sensorValue} weather data for the last ${event.scaleValue}`, weatherData);
        console.log("Processed weatherData: ", this.weatherData);
        this.updateOptions(this.weatherData); // Ensure chart options are updated
      },
      error: (error: any) => {
        this.errorMessage = error;
      }
    })

    // Update the y-axis label and sensor type
    this.sensorLabel = event.sensorLabel;
    this.sensor = event.sensorValue;
    // This must be called when making any changes to the chart
    //this.updateOptions(this.weatherData);
  }
}
