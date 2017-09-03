import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { WeatherService } from '../weather.service';
import { TimeScaleService } from '../time-scale.service';

import { TimeScaleValue } from './time-scale-value'

@Component({
  selector: 'app-time-scale',
  templateUrl: './time-scale.component.html',
  styleUrls: ['./time-scale.component.css']
})
export class TimeScaleComponent implements OnInit {
// TODO: add TimeScaleValue class to the 'options' Input value.
  @Input() timeScale = [];

   @Input() sensorData = 
   [
     { key: 'Temp F', value: 'tempf'},
     { key: 'Temp C', value: 'tempc'}, 
     { key: 'Altitude Ft', value: 'altitude_ft'},
     { key: 'Altitude M', value: 'altitude_m'},
     { key: 'Humidity %RH', value: 'humidity'},
     { key: 'Pressure Pa', value: 'pressure'},
     { key: 'Uptime sec', value: 'time'}
    ]

  @Output() select: EventEmitter<any> = new EventEmitter<any>();

  constructor(private timeScaleService: TimeScaleService) {}

  timeScaleTitle = 'Time Scale';
  now = new Date();
  scale = new Date(new Date().setHours(this.now.getHours()- 24)).toISOString();
  sensor = this.sensorData[0].value;

  ngOnInit() {
    //this.options = this.timeScaleService.getTimeScaleOptions();
    this.timeScale = [
      {key: 'Day',   value: new Date(new Date().setHours(this.now.getHours()- 24)).toISOString()},
      {key: 'Week',  value: new Date(new Date().setDate(this.now.getDate() - 7)).toISOString()},
      {key: 'Month', value: new Date(new Date().setMonth(this.now.getMonth() - 1)).toISOString()},
      {key: 'Year',  value: new Date(new Date().setFullYear(this.now.getFullYear() - 1)).toISOString()}
    ]
    console.log(this.timeScale);
    console.log(this.sensorData);
  }

  // Function called when Time Scale button is selected
  selectTimeScale(timeScaleValue:string) {
    this.scale = timeScaleValue;
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
