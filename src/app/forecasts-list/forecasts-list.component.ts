import { Component } from '@angular/core';
import {WeatherService} from '../weather.service';
import {ActivatedRoute} from '@angular/router';
import {Forecast} from './forecast.type';
import {tap} from 'rxjs/operators';
import {CacheService} from '../cache.service';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent {

  zipcode: string;
  forecast: Forecast;

  constructor(protected weatherService: WeatherService, route : ActivatedRoute,
              private cacheService: CacheService) {

    route.params.subscribe(params => {
      this.zipcode = params['zipcode'];
      weatherService.getForecast(this.zipcode)
          .pipe(
              tap((forecastData: any) => {
                  const localForecast = this.cacheService.getCacheFromLocalstorage(this.weatherService.FORECAST);
                  for (let forecast of localForecast) {
                      /*if already in the localstorage, do not push again*/
                     if(JSON.stringify({a: forecast}) === JSON.stringify({a: forecastData})) return;
                  }
                localForecast.push(forecastData);
                localStorage.setItem(this.weatherService.FORECAST, JSON.stringify(localForecast));
              })
          ).subscribe(data => this.forecast = data);
    });
  }
}
