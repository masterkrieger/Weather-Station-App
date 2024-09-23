/*
* TODO: 
* - Add dashboard component
* -- include current weather data (like WeatherUnderground)
* -- include historical weather data as a chart
* - Add .env file for environment variables (https://medium.com/@desinaoluseun/using-env-to-store-environment-variables-in-angular-20c15c7c0e6a)
*/

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Weather Station App';
}
