import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ChangeEvent } from 'angular-virtual-list';

import { ListItem } from './list-item.component';

@Component({
  selector: 'list-with-api',
  template: `
    <div class="status">
      Showing <span class="badge">{{indices?.start + 1}}</span>
      - <span class="badge">{{indices?.end}}</span>
      of <span class="badge">{{buffer?.length}}</span>
      <span>({{scrollItems?.length}} nodes)</span>
    </div>

    <virtual-list
      class="list"
      [source$]="source$"
      [visibleChildren]="3"
      (update)="scrollItems = $event"
      (end)="fetchMore($event)">

      <list-item class="list-item" *ngFor="let item of scrollItems" [item]="item" [class.alt]="item.order % 2 === 0"></list-item>
      <div [class.visible]="loading" class="loader">Loading...</div>

    </virtual-list>
    `,
  styleUrls: ['./list-with-api.scss']
})
export class ListWithApiComponent {

  loading: boolean;
  indices: ChangeEvent;
  items: ListItem[] = [];
  scrollItems: ListItem[];
  buffer: ListItem[] = [];
  timer: number | undefined;

  source$ = new BehaviorSubject<ListItem[]>(null);

  readonly bufferSize: number = 10;

  @Input()
  set items$(observable: Observable<ListItem[]>) {
    if (observable instanceof Observable) {
      // We take the value only one time
      observable
        .filter(value => value instanceof Array)
        .take(1)
        .subscribe(value => {
          this.items = value.map(item => ({ ...item }));
          this.reset();
        });
    }
  }

  reset() {
    this.fetchNextChunk(0, this.bufferSize).then(chunk => {
      this.buffer = chunk;
      this.source$.next(this.buffer);
    });
  }

  fetchMore(event: ChangeEvent) {
    this.indices = event;
    if (event.end === this.buffer.length) {
      this.loading = true;
      this.fetchNextChunk(this.buffer.length, this.bufferSize, 3000 + Math.random() * 1000).then(chunk => {
        this.loading = false;
        this.buffer = this.buffer.concat(chunk);
        this.source$.next(this.buffer);
      }, () => this.loading = false);
    }
  }

  fetchNextChunk(skip: number, limit: number, timeout: number = 0): Promise<ListItem[]> {
    return new Promise((resolve, reject) => {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
      }
      this.timer = window.setTimeout(() => {
        if (skip < this.items.length) {
          return resolve(this.items.slice(skip, skip + limit));
        }
        reject();
      }, timeout);
    });
  }
}
