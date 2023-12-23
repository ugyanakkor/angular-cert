import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export const LOCATIONS: string = 'locations';

@Injectable()
export class LocationService {

  locations = new BehaviorSubject<Array<string>>([]);

  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) this.locations.next(JSON.parse(locString));
  }

  addLocation(zipcode: string) {
    const actualLocations = this.locations.getValue();
    if(actualLocations.includes(zipcode)) return;
    this.locations.next([...actualLocations, zipcode]);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations.getValue()));
  }

  removeLocation(zipcode: string) {
    let copyLocations = this.locations.getValue();
    const index =  copyLocations.indexOf(zipcode);

    if (index !== -1){
      copyLocations.splice(index, 1);
      this.locations.next(copyLocations);
      localStorage.setItem(LOCATIONS, JSON.stringify(copyLocations));
    }
  }
}
