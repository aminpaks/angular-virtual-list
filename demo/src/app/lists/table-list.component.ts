import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ListItem } from './list-item.component';

@Component({
  selector: 'table-list',
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
      [height]="'off'"
      [source$]="source$"
      (update)="scrollItems = $event"
      (change)="indices = $event">
      <table>
        <colgroup>
          <col span="1" style="width: 5%;">
          <col span="1" style="width: 24%;">
          <col span="1" style="width: 8%;">
          <col span="1" style="width: 3%;">
          <col span="1" style="width: 60%;">
        </colgroup>
        <tr #virtualListChildElement *ngFor="let item of scrollItems" [class.alt]="item.order % 2 === 0">
          <td>{{item.index}}</td>
          <td>{{item.name}}</td>
          <td>{{item.gender}}</td>
          <td>{{item.age}}</td>
          <td><span title="{{item.address}}">{{(item.address.length > 50) ? (item.address | slice:0:50) + '...' : item.address}}</span></td>
        </tr>
      </table>
    </virtual-list>
    <p><strong>Note:</strong> You can set the height of virtual-list explicitly by <code>height</code> property instead of
      <code>visibleChildren</code>. This makes <code>visibleChildren</code> to have no effect (disabled).
      if you want to set the height by stylesheets you need to set the <code>height</code> property to <code>'off'</code>
        and define the height of virtual-list by css like example above.</p>
  `,

  styleUrls: ['./table-list.scss']
})
export class TableListComponent {

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
