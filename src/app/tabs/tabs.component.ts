import {Component, Input} from '@angular/core';
import {AsyncPipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {EntityService} from '../entity.service';
import {CardComponent} from '../card/card.component';
import {Router, RouterLink} from '@angular/router';
import {CacheService} from '../cache.service';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe,
    CardComponent,
    DecimalPipe,
    NgIf,
    RouterLink
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent {
  protected _items;
  protected _cacheName;
  @Input() tabNames;
  @Input() set items (items) {
    this._items = items;
    this.entityService.index.next(0);
    this.entityService.entity.next(this._items[0]);
  };
/*Name of the cache where should remove an item*/
  @Input() set cacheName (cacheName) {
    this._cacheName = cacheName;
  };

  /*set an onclick method on app-card component from outside to be more generic*/
  @Input() appCardClickFunction: (args) => void;

  /*set the image source from outside*/
  @Input() imageSource: (args) => string;

  constructor(protected entityService: EntityService,
              protected router: Router,
              private cacheService: CacheService) {
  }

  setIndex(index: number): void {
    if(index) this.entityService.index.next(index);
    else this.entityService.index.next(0);
  }

  setItem(item: object): void{
    if(item) this.entityService.entity.next(item);
    else this.entityService.entity.next({});
  }

  removeLocation(index: number): void {
    /*do not navigate into forecast when we delete an item*/
    event.stopPropagation();
    this.cacheService.removeItemFromCacheByIndex(this._cacheName, index);
  }
}
