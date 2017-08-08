
## Angular Virtual List

This is a component to simulate virtual scroll for elements in Angular(v4)
Forked from this [repository](https://github.com/rintoj/angular2-virtual-list).

## About

This module displays a small subset of records just enough to fill the viewport and uses the same DOM elements as the user scrolls.
This method is effective because the number of DOM elements are always constant and tiny irrespective of the size of the list. Thus virtual scroll can display infinitely growing list of items in an efficient way.

* Supports multi-column
* Supports more than one million elements

## Usage

```html
<virtual-list [source$]="items$" (update)="viewPortItems = $event">

    <div *ngFor="let item of viewPortItems">{{item?.title}}</div>

</virtual-list>
```

## Get Started

**Step 1:** Install angular-virtual-list

```sh
npm install angular-virtual-list --save
```
or
```sh
yarn add angular-virtual-list
```

**Step 2:** Import virtual list module into your app, or any module that consumes it.

```ts
import { VirtualListModule } from 'angular-virtual-list';

@NgModule({
    ...
    imports: [
        ....
        VirtualListModule,
    ],
})
export class AppModule { }
```

**Step 3:** Add your list item template;

```ts
<virtual-list [source$]="items$" (update)="viewPortItems = $event">

    <div *ngFor="let item of viewPortItems">{{item?.title}}</div>

</virtual-list>
```

## API

| Attribute      | Type   | Description
|----------------|--------|------------
| source$          | Observable<T>[]  | The data that builds the templates within the virtual scroll. This is the same data that you'd pass to ngFor. This input is an observable of an array containing your elements.
| height    | string | The exact height of virtual list if you don't want to the height to be calculated based on visibility counts of children. Can be any valid measure value or simple `'off'` to let you set the height by styles.
| childHeight    | number | The exact height of the child item template. This is an optional input, virtual list will determine the height of elements automatically if this is not set.
| visibleChildren   | number | Default is 6. This set the visible items inside of view port.
| bufferAmount   | number | The the number of elements to be rendered outside of the current container's viewport. Useful when not all elements are the same dimensions.
| update         | Event  | This event is fired every time `start` or `end` index change and emits list of items from `start` to `end`. The list emitted by this event must be used with `*ngFor` to render the actual list of items within `<virtual-list>`
| change         | Event  | This event is fired every time `start` or `end` index change and emits `ChangeEvent` which of format: `{ start: number, end: number }`


## Lazy Loading

The event `end` is fired every time scroll reaches at the end of the list. You could use this to load more items at the end of the scroll. See below.

```ts
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ChangeEvent } from 'angular-virtual-list';
...

@Component({
    selector: 'list-with-api',
    template: `
        <virtual-list
            [source$]="items$"
            (update)="scrollItems = $event"
            (end)="fetchMore($event)">

            <div *ngFor="let item of scrollItems">{{item?.title}}</div>
            <div *ngIf="loading" class="loader">Loading...</div>

        </virtual-list>
    `
})
export class ListWithApiComponent implements OnChanges {

    @Input()
    items: ListItem[];

    protected items$ = new BehaviorSubject<ListItem[]>(null);
    protected buffer: ListItem[] = [];
    protected loading: boolean;

    protected fetchMore(event: ChangeEvent) {
        if (event.end !== this.buffer.length) return;
        this.loading = true;
        this.fetchNextChunk(this.buffer.length, 10).then(chunk => {
            this.buffer = this.buffer.concat(chunk);
            this.items$.next(this.buffer);
            this.loading = false;
        }, () => this.loading = false);
    }

    protected fetchNextChunk(skip: number, limit: number): Promise<ListItem[]> {
        return new Promise((resolve, reject) => {
            ....
        });
    }
}
```

```ts
import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VirtualListComponent } from 'angular-virtual-list';

@Component({
    selector: 'test-list',
    template: `
        <virtual-list [source$]="items$" (update)="scrollList = $event">
            <div *ngFor="let item of scrollList; let i = index"> {{i}}: {{item}} </div>
        </virtual-list>
    `
})
export class ListComponent {

    items = ['Item1', 'Item2', 'Item3'];
    items$ = Observable.of(this.items);

    @ViewChild(VirtualListComponent)
    private virtualList: VirtualListComponent;

    // call this function after resize + animation end
    afterResize() {
        this.virtualList.refresh();
    }
}
```

## Focus on an item

You could use `scrollInto(item)` api to scroll into an item in the list. See below:

```ts
import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VirtualListComponent } from 'angular-virtual-list';

@Component({
    selector: 'test-list',
    template: `
        <virtual-list [items]="items$" (update)="scrollList = $event">
            <div *ngFor="let item of scrollList; let i = index"> {{i}}: {{item}} </div>
        </virtual-list>
    `
})
export class ListComponent {

    items = ['Item1', 'Item2', 'Item3'];
    items$ = Observable.of(this.items);

    @ViewChild(VirtualListComponent)
    private virtualList: VirtualListComponent;

    // call this function whenever you have to focus on second item
    focusOnAnItem() {
        this.virtualList.scrollInto(items[1]);
    }
}
```

## Credits

Initial developer: [Rinto Jose](https://github.com/rintoj)