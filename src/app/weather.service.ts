import {Injectable, Signal, signal} from '@angular/core';
import {Observable, of} from 'rxjs';

import {HttpClient} from '@angular/common/http';
import {CurrentConditions} from './current-conditions/current-conditions.type';
import {ConditionsAndZip} from './conditions-and-zip.type';
import {Forecast} from './forecasts-list/forecast.type';
import {LOCATIONS, LocationService} from './location.service';
import {map, tap} from 'rxjs/operators';
import {CacheService} from './cache.service';

@Injectable()
export class WeatherService {
    static URL = 'http://api.openweathermap.org/data/2.5';
    static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
    static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
    public FORECAST: string = 'forecast';
    private currentConditions = signal<ConditionsAndZip[]>([]);
    private actualTime: number;
    private CONDITIONS: string = 'conditions';

    constructor(private http: HttpClient,
                private locationService: LocationService,
                private cacheService: CacheService) {
        this.locationService.locations
            .pipe(
                tap((zipcodes) => {
                    const zipcodesFromCache = this.cacheService.getCacheFromLocalstorage(LOCATIONS);
                    const conditionsFromCache = this.cacheService.getCacheFromLocalstorage(this.CONDITIONS);
                    this.actualTime = Date.now();

                    this.currentConditions.set([]);
                    for (let zipcode of zipcodes) {
                        // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
                        if(!zipcodesFromCache.includes(zipcode)) this.getConditionsFromApi(zipcode);
                        else this.getConditionsFromCache(conditionsFromCache, zipcode);
                    }
                })
            ).subscribe();
    }

    getCurrentConditions(): Signal<ConditionsAndZip[]> {
        return this.currentConditions.asReadonly();
    }

    getForecast(zipcode: string): Observable<Forecast> {
        const forecasts = this.cacheService.getCacheFromLocalstorage(this.FORECAST);
        this.actualTime = Date.now();

        let forecast =  this.getForecastFromCache(forecasts, zipcode)
        if(forecast) return of(forecast);
        else {
            this.removeForecastFromCache(forecasts, zipcode);
            return this.getForecastFromApi(zipcode);
        }
    }

    getForecastFromCache(forecasts: Array<Forecast>, zipcode: string): Forecast  {
        /*if already in localstorage and time hasn't expired, use that value and don't make api request*/
        for (let forecast of forecasts) {
            if(forecast.zipcode === zipcode && (this.actualTime - forecast.cacheTime < this.cacheService.cacheTimer ))
                return forecast;
        }
    }

    removeForecastFromCache(forecasts: Array<Forecast>, zipcode: string): void {
        /*if we need to make an API request, remove the old value from localstorage*/
        for (let forecast of forecasts) {
            if(forecast.zipcode === zipcode) {
                const indexOfForecast = forecasts.indexOf(forecast);
                forecasts.splice(indexOfForecast, 1);
                this.cacheService.setCacheToLocalstorage(this.FORECAST, forecasts);
            }
        }
    }

    getForecastFromApi(zipcode: string): Observable<Forecast> {
        // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
        return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`)
        .pipe(
            map((forecast) => ({...forecast, cacheTime: this.actualTime, zipcode: zipcode})
        ));
    }

    getConditionsFromApi(zipcode: string): void {
        this.http.get<CurrentConditions>
        (`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
            .subscribe(data => {
                const condition  = {data, zip: zipcode, cacheTime: this.actualTime };
                this.currentConditionUpdate(zipcode, condition)
            });
    }

    getConditionsFromCache(conditionsFromCache, zipcode: string): void {
        for(let condition of conditionsFromCache) {
            const cacheHasExpired = this.actualTime - condition.cacheTime >= this.cacheService.cacheTimer;
            if(condition.zip === zipcode && !cacheHasExpired){
               this.currentConditionUpdate(zipcode, condition);
            }else if (condition.zip === zipcode && cacheHasExpired){
                this.getConditionsFromApi(zipcode);
            }
        }
    }

    currentConditionUpdate(zipcode: string, condition: ConditionsAndZip): void {
        this.currentConditions.update(conditions => {
            const updatedItems =  [...conditions, {zip: zipcode, ...condition}]
            this.cacheService.setCacheToLocalstorage(this.CONDITIONS, updatedItems)
            return updatedItems;
        })
    }

    getWeatherIcon(id): string {
        if (id >= 200 && id <= 232) {
            return WeatherService.ICON_URL + 'art_storm.png';
        } else if (id >= 501 && id <= 511) {
            return WeatherService.ICON_URL + 'art_rain.png';
        } else if (id === 500 || (id >= 520 && id <= 531)) {
            return WeatherService.ICON_URL + 'art_light_rain.png';
        } else if (id >= 600 && id <= 622) {
            return WeatherService.ICON_URL + 'art_snow.png';
        } else if (id >= 801 && id <= 804) {
            return WeatherService.ICON_URL + 'art_clouds.png';
        } else if (id === 741 || id === 761) {
            return WeatherService.ICON_URL + 'art_fog.png';
        } else {
            return WeatherService.ICON_URL + 'art_clear.png';
        }
    }

}
