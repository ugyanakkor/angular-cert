import {Component, effect, inject, Signal} from '@angular/core';
import {WeatherService} from "../weather.service";
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {
  protected tabNames = new BehaviorSubject<Array<string>>([]);
  protected weatherService = inject(WeatherService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  constructor() {
    effect(() => {
      let tabNames: Array<string> = [];
      for(let currentConditions of this.currentConditionsByZip()){
        tabNames.push(`${currentConditions.data.name} (${currentConditions.zip})`);
      }
      this.tabNames.next(tabNames);
    })
  }
}
