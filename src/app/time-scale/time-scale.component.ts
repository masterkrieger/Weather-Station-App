import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { WeatherService } from '../weather.service';

import { TimeScaleValue } from './time-scale-value'

@Component({
  selector: 'app-time-scale',
  templateUrl: './time-scale.component.html',
  styleUrls: ['./time-scale.component.css']
})
export class TimeScaleComponent implements OnInit {

  @Input() timeScale = 
  [
    {key: 'Day',   value: 'day'},
    {key: 'Week',  value: 'week'},
    {key: 'Month', value: 'month'},
    {key: 'Year',  value: 'year'}
  ];

  @Input() sensorData = 
  [
    { key: 'Temp F', value: 'tempf'},
    { key: 'Temp C', value: 'tempc'}, 
    { key: 'Humidity %RH', value: 'humidity'},
    { key: 'Pressure Pa', value: 'pressure'},
    { key: 'Uptime sec', value: 'time'}
  ]

  @Output() select: EventEmitter<any> = new EventEmitter<any>();

  /* Initialize variables */
  timeScaleTitle = 'Time Scale';
  now:Date;
  scale:string;
  sensor:string;

  ngOnInit() {

    // Set default values to scale and sensor on Initialization
    this.scale = this.setTimeScaleValues("day");
    this.sensor = this.sensorData[0].value;
    console.log(this.timeScale);
    console.log(this.sensorData);

    // emits default timeScale values on Initialization.
    this.emitValues(this.sensor, this.scale);  
  }

  setTimeScaleValues(timeScaleValue:string):string {
    this.now = new Date();
    var timeQuery:string;
    switch (timeScaleValue) {
      case "day":
        // last 24 hrs from now
        timeQuery = new Date(new Date().setHours(this.now.getHours()- 24)).toISOString();
        break;
      case "week":
        // last 7 days from now
        timeQuery = new Date(new Date().setDate(this.now.getDate() - 7)).toISOString();
        break;
      case "month":
        // last Month from now
        timeQuery = new Date(new Date().setMonth(this.now.getMonth() - 1)).toISOString();
        break;
      case "year":
        // last Year from now
        timeQuery = new Date(new Date().setFullYear(this.now.getFullYear() - 1)).toISOString();
        break;
      default:
        // Assign param to the request
        timeQuery = new Date(this.now).toISOString();
    }
    return timeQuery;//this.timeScale[timeScaleKey].value;
  }

  // Function called when Time Scale button is selected
  selectTimeScale(timeScaleValue:string) {
    this.scale = this.setTimeScaleValues(timeScaleValue);
    this.emitValues(this.sensor, this.scale);
    console.log(this.scale);
  }

  // Function called when Time Scale button is selected
  selectSensor(sensorValue:string) {
    this.sensor = sensorValue;
    this.emitValues(this.sensor, this.scale);
    console.log(this.sensor);
  }

  // Called to output the EventEmitter of the time-scale and sensor data values to the parent component
  emitValues(sensorValue:string, scaleValue:string ) {
    this.select.emit({sensorValue:sensorValue,scaleValue:scaleValue});
  }

}
