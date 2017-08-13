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
  @Input() options =
    [
      {key: 'Today', value: '5'},
      {key: '24hr',  value: '10'},
      {key: 'Week',  value: '15'},
      {key: 'Month', value: '20'}
    ];

  @Output() select: EventEmitter<any> = new EventEmitter<any>();

  constructor(private timeScaleService: TimeScaleService) {}

  timeScaleTitle = 'Time Scale';
  isOpen: boolean = false;

  ngOnInit() {
    //this.options = this.timeScaleService.getTimeScaleOptions();
    console.log(this.options);
  }

  // Emit dropdown value to the parent component (Weather Component)
  selectItem(value:string) {
    this.select.emit(value);
    console.log(value);
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

}
