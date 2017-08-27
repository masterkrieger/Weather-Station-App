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
  @Input() timeScale =
    [
      {key: '24hr', value: '24hr'},
      {key: 'Week',  value: 'week'},
      {key: 'Month', value: 'month'},
      {key: 'Year', value: 'year'}
    ];

   @Input() sensorData = 
   [
     { key: 'Temp F', value: 'tempf'},
     { key: 'Temp C', value: 'tempc'}, 
     { key: 'Altitude (Ft)', value: 'altitude_ft'},
     { key: 'Altitude (M', value: 'altitude_m'},
     { key: 'Humidity %RH', value: 'humidity'},
     { key: 'Pressure Pa', value: 'pressure'},
     { key: 'Uptime sec', value: 'time'}
    ]

  @Output() select: EventEmitter<any> = new EventEmitter<any>();

  constructor(private timeScaleService: TimeScaleService) {}

  timeScaleTitle = 'Time Scale';
  scale = this.timeScale[0].value;
  sensor = this.sensorData[0].value;

  ngOnInit() {
    //this.options = this.timeScaleService.getTimeScaleOptions();
    console.log(this.timeScale);
    console.log(this.sensorData);
  }

  // Function called when Time Scale button is selected
  selectTimeScale(timeScaleValue:string) {
    this.scale = timeScaleValue;
    this.emitValues(this.scale, this.sensor);
    console.log(this.scale);
  }

  // Function called when Time Scale button is selected
  selectSensor(sensorValue:string) {
    this.sensor = sensorValue;
    this.emitValues(this.scale, this.sensor);
    console.log(this.sensor);
  }

  // Called to output the EventEmitter of the time-scale and sensor data values to the parent component
  emitValues(scaleValue:string, sensorValue:string ) {
    this.select.emit({scaleValue:scaleValue,sensorValue:sensorValue});
  }

}
