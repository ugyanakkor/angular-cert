import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntityService {
  public index = new BehaviorSubject<number>(0);
  public entity = new BehaviorSubject<unknown>({});
}
