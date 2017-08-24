import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ListItem } from './list-item.component';

@Component({
  selector: 'table-like-list',
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

    <div class="table-like">
      <div class="table-head">
        <span (click)="sortByIndex()" class="sortable">-</span>
        <span (click)="sortByName()" class="sortable">Name</span>
        <span>Gender</span>
        <span>Age</span>
        <span>Address</span>
      </div>
      <virtual-list
        class="list"
        [source$]="source$"
        (update)="scrollItems = $event"
        (change)="indices = $event">
        <div class="table-body">
          <div class="table-row" #virtualListChildElement *ngFor="let item of scrollItems" [class.alt]="item.order % 2 === 0">
            <span>{{item.index}}</span>
            <span>{{item.name}}</span>
            <span>{{item.gender}}</span>
            <span>{{item.age}}</span>
            <span title="{{item.address}}">{{(item.address.length > 50) ? (item.address | slice:0:50) + '...' : item.address}}</span>
          </div>
        </div>
      </virtual-list>
    </div>
    <p><strong>Note:</strong> As you can see this component looks like a table but it's basically a table like component built
      by <code>flexbox</code>.</p>
  `,

  styleUrls: ['./table-like-list.scss']
})
export class TableLikeListComponent {

  indices: any;
  items: ListItem[] = [];
  scrollItems: ListItem[];
  filteredList: ListItem[] = [];
  source$ = new BehaviorSubject<ListItem[]>(null);

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
