/*
* TODO: 
* - Add dashboard component
* -- include current weather data (like WeatherUnderground)
* -- include historical weather data as hart
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
