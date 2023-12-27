import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CacheService} from './cache.service';
import {filter, tap} from 'rxjs/operators';

export const LOCATIONS: string = 'locations';

@Injectable()
export class LocationService {

  locations = new BehaviorSubject<Array<string>>([]);

  constructor(private cacheService: CacheService) {
    this.cacheService.readCacheAgain
        .pipe(
            filter((read) => !!read),
            tap(() => this.setLocationsFromCache())
        )
        .subscribe()
  }

  addLocation(zipcode: string) {
    const actualLocations = this.locations.getValue();
    if(actualLocations.includes(zipcode)) return;
    this.locations.next([...actualLocations, zipcode]);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations.getValue()));
  }

  setLocationsFromCache() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) this.locations.next(JSON.parse(locString));
  }
}
