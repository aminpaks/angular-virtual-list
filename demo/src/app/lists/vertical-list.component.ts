import * as randomName from 'random-name';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ChangeEvent } from 'angular-virtual-list';

import { ListItem } from './list-item.component';

@Component({
  selector: 'vertical-list',
  template: `
    <button (click)="sortByName()">Sort By Name</button>
    <button (click)="sortByIndex()">Sort By Index</button>
    <button (click)="reduceListToEmpty()">Reduce to 0 Items</button>
    <button (click)="reduceList()">Reduce to 100 Items</button>
    <button (click)="setToFullList()">Revert to 1000 Items</button>
    <button (click)="setToBigList()">Increase to 1,000,000 Items</button>
    <button (click)="removeSource()">Remove source from list component</button>
    <div class="visible-children-input">
      <label>Set visible children: <input type="number" [(ngModel)]="visibleChildren" /></label>
    </div>

    <div class="status">
        Showing <span class="badge">{{(indices?.start >= 0) ? indices.start + 1 : 0}}</span>
        - <span class="badge">{{indices?.end}}</span>
        of <span class="badge">{{filteredList?.length}}</span>
      <span>({{scrollItems?.length}} nodes)</span>
      </div>

    <virtual-list
      class="list"
      [source$]="source$"
      [visibleChildren]="visibleChildren"
      (update)="scrollItems = $event"
      (change)="indices = $event">

      <list-item class="list-item" *ngFor="let item of scrollItems" [item]="item" [class.alt]="item.order % 2 === 0"></list-item>

    </virtual-list>
  `,
  styleUrls: ['./vertical-list.scss'],
})
export class VerticalListComponent {

  indices: ChangeEvent = { start: 0, end: 0 };
  visibleChildren = 3;
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
          this.items = value.map(item => ({ ...item }));
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

  removeSource() {
    this.filteredList = [];
    this.source$.next(this.filteredList);
    this.source$.complete();
  }

  setToBigList() {
    const gender = ['Male', 'Female'];
    this.filteredList = Array(1000000).fill(0).map((_no, idx) => {
      const address = `${Math.floor(Math.random() * 999) + 100}
         ${randomName.place(12)} ${randomName.middle()}, ${Math.floor(Math.random() * 9999) + 1000}`;
      const name: string = randomName();
      const email = name.toLowerCase().replace(/\s/g, '.');
      return <ListItem>{
        index: idx,
        order: idx,
        age: Math.floor(Math.random() * 50 + 20),
        name,
        gender: gender[Math.floor(Math.random() * 2)],
        company: 'company test ' + idx,
        phone: `+1 (960) 439-2351 (${idx})`,
        email: `${email}@me.com`,
        address,
      };
    });
    this.source$.next(this.filteredList);
  }
}
