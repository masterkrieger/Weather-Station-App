import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// amCharts
import { AmChartsModule } from "@amcharts/amcharts3-angular";

// Weather Components
import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';
import { TimeScaleComponent } from './time-scale/time-scale.component';

// Services
import { WeatherService } from './weather.service';

// Define the routes
const ROUTES = [
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full',
  },
  {
    path: '',
    component: WeatherComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    TimeScaleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    AmChartsModule
  ],
  providers: [WeatherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
