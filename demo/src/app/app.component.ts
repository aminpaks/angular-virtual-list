import {
  Component,
  OnInit,
} from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ListItem } from './lists/list-item.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  items$ = new BehaviorSubject<ListItem[]>(null);

  readonly codeListWithApi = `
        import { ChangeEvent } from '@angular-virtual-scroll';
        ...

        @Component({
            selector: 'list-with-api',
            template: \`
                <virtual-scroll [items]="buffer" (update)="scrollItems = $event"
                    (change)="onListChange($event)">

                    <list-item *ngFor="let item of scrollItems" [item]="item"> </list-item>
                    <div *ngIf="loading" class="loader">Loading...</div>

                </virtual-scroll>
            \`
        })
        export class ListWithApiComponent implements OnChanges {

            @Input()
            items: ListItem[];

            protected buffer: ListItem[] = [];
            protected loading: boolean;

            protected onListChange(event: ChangeEvent) {
                if (event.end !== this.buffer.length) return;
                this.loading = true;
                this.fetchNextChunk(this.buffer.length, 10).then(chunk => {
                    this.buffer = this.buffer.concat(chunk);
                    this.loading = false;
                }, () => this.loading = false);
            }

            protected fetchNextChunk(skip: number, limit: number): Promise<ListItem[]> {
                return new Promise((resolve, reject) => {
                    ....
                });
            }
        }
    `.replace(/^        /mg, '');

  constructor (private http: Http) {}

  ngOnInit() {
    this.http.get('assets/data/items.json')
      .map(response => response.json())
      .subscribe((data: ListItem[]) => {
        this.items$.next(data.map((item, idx) => {
          item.order = idx;
          return item;
        }));
      });
  }
}
