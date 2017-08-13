import { Injectable } from '@angular/core';

import {TimeScaleValue} from './time-scale/time-scale-value';

@Injectable()
export class TimeScaleService {

  constructor() { }

  /*
  getTimeScaleOptions(): TimeScaleValue {

    let options: TimeScaleValue[] =
      [
        {key: 'Today', value: 'Today'},
        {key: '24hr',  value: '24hrs'},
        {key: 'week',  value: 'Week'},
        {key: 'month', value: 'Month'}
      ];

    return options;
  }*/
}
