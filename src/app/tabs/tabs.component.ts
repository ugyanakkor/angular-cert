import {Component, Input} from '@angular/core';
import {NgForOf} from '@angular/common';
import {EntityService} from '../entity.service';
import {LocationService} from '../location.service';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent {
  protected _items;
  @Input() tabNames;
  @Input() set items (items) {
    this._items = items;
    this.entityService.index.next(this._items[0]?.zip);
    this.entityService.entity.next(this._items[0]);
  };

  constructor(private entityService: EntityService,
              private locationService: LocationService) {
  }

  setIndex(index: number) {
    if(index) this.entityService.index.next(index);
    else this.entityService.index.next(0);
  }

  setItem(item: object){
    if(item) this.entityService.entity.next(item);
    else this.entityService.entity.next({});
  }

  removeLocation(zip: string) {
    this.locationService.removeLocation(zip);
  }
}
