import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ListItem } from './list-item.component';

@Component({
  selector: 'multi-col-list',
  template: `

    <button (click)="sortByName()">Sort By Name</button>
    <button (click)="sortByIndex()">Sort By Index</button>
    <button (click)="reduceListToEmpty()">Reduce to 0 Items</button>
    <button (click)="reduceList()">Reduce to 100 Items</button>
    <button (click)="setToFullList()">Revert to 1000 Items</button>

    <div class="status">
        Showing <span class="badge">{{indices?.start + 1}}</span>
        - <span class="badge">{{indices?.end}}</span>
        of <span class="badge">{{filteredList?.length}}</span>
      <span>({{scrollItems?.length}} nodes)</span>
      </div>

    <virtual-list
      class="list"
      [source$]="source$"
      [visibleChildren]="2"
      (update)="scrollItems = $event"
      (change)="indices = $event">

      <list-item class="list-item" *ngFor="let item of scrollItems" [item]="item" [class.alt]="item.order % 4 >= 2"></list-item>

    </virtual-list>
  `,
  styleUrls: ['./multi-col-list.scss']
})
export class MultiColListComponent {

  indices: any;
  items: ListItem[] = [];
  scrollItems: ListItem[];
  filteredList: ListItem[] = [];
  source$ = new BehaviorSubject<ListItem[]>(undefined);

  @Input()
  set items$(observable: Observable<ListItem[]>) {
    if (observable instanceof Observable) {
      // We take the value only one time
      observable
        .filter(value => value instanceof Array)
        .take(1)
        .subscribe(value => {
          this.items = value.map(item => ({...item}));
          this.setToFullList();
        });
    }
  }

  reduceListToEmpty() {
    this.filteredList = [];
    this.source$.next(this.filteredList);
  }

  reduceList() {
    this.filteredList = this.items
      .slice(0, 100)
      .map((item, idx) => {
        item.order = idx;
        return item;
      });
    this.source$.next(this.filteredList);
  }

  sortByName() {
    this.filteredList = this.filteredList
      .sort((a, b) => -(a.name < b.name) || +(a.name !== b.name))
      .map((item, idx) => {
        item.order = idx;
        return item;
      });
    this.source$.next(this.filteredList);
  }

  sortByIndex() {
    this.filteredList = this.filteredList
      .sort((a, b) => -(a.index < b.index) || +(a.index !== b.index))
      .map((item, idx) => {
        item.order = idx;
        return item;
      });
    this.source$.next(this.filteredList);
  }

  setToFullList() {
    this.filteredList = this.items
      .slice()
      .map((item, idx) => {
        item.order = idx;
        return item;
      });
    this.source$.next(this.filteredList);
  }
}
