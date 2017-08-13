import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// ngx-charts
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Weather Components
import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';
import { TimeScaleComponent } from './time-scale/time-scale.component';

// Services
import { WeatherService } from './weather.service';
import { TimeScaleService } from './time-scale.service';

// Define the routes
const ROUTES = [
  {
    path: '',
    redirectTo: 'weather',
    pathMatch: 'full',
  },
  {
    path: 'weather',
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
    BrowserAnimationsModule,
    NgxChartsModule
  ],
  providers: [WeatherService, TimeScaleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
