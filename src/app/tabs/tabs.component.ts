import {
  AfterContentChecked, ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList
} from '@angular/core';
import {AsyncPipe, DecimalPipe, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {EntityService} from '../entity.service';
import {CardComponent} from '../card/card.component';
import {Router, RouterLink} from '@angular/router';
import {CacheService} from '../cache.service';
import {TabComponent} from './tab/tab.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe,
    CardComponent,
    DecimalPipe,
    NgIf,
    RouterLink,
    TabComponent,
    NgTemplateOutlet
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent implements AfterContentChecked {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  activeComponent: TabComponent;


  protected _items;
  /*set tha tab names*/
  @Input() tabNames;

  /*set the items to corresponding to tabNames*/
  @Input() set items (items) {
    this._items = items;
    this.entityService.index.next(0);
    this.entityService.entity.next(this._items[0]);
  };

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
    this.cacheService.removeItemFromCacheByIndex('locations', index);
  }

  ngAfterContentChecked (): void {
    /*Focus first tab after content checked*/
    let tab = this.tabs.first;
    if(tab) {
      tab.hidden.next(false);
      this.activeComponent = tab;
    }
  }

  activateTab(tab: TabComponent): void {
    if(!tab) return;

    this.tabs.map((tab) => tab.hidden.next(true));
    tab.hidden.next(false);
    this.activeComponent = tab;
  }
}
