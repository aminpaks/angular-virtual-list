
## Angular Virtual List

This is a component to simulate virtual scroll for elements in Angular(v4)
Forked from this [project](https://github.com/rintoj/angular2-virtual-scroll).

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
| source$          | Observable<T[]>  | The source of data that builds the templates within the virtual list. This is the same data that you would pass to ngFor be ngFor will received splice of it. This input is an observable of an array containing your elements.
| height    | string | The exact height of virtual list if you don't want the height of list to be calculated based on visible children you can set property. The value can be any valid metrics or you may set it to `'off'` if you want to set the height of the list by styles, such as `style="height: 300px"`.
| childHeight    | number | The exact height of each child item. This is an optional input, virtual list will determine the height of elements automatically if this is not set. but this will have a bad result if they children's size are vary.
| visibleChildren   | number | Default is 6. This set the visible items inside of view port.
| bufferAmount   | number | The the number of elements to be rendered outside of the current container's viewport. Useful when not all elements are the same dimensions.
| update         | Event  | This event is fired every time `start` or `end` index change and emits list of items from `start` to `end`. The list emitted by this event must be used with `*ngFor` to render the actual list of items within `<virtual-list>`
| change         | Event  | This event is fired every time `start` or `end` index change and emits `ChangeEvent` which of format: `{ start: number, end: number }`
| scrollInto    | Method | This is a method to find and show one specific item from the source list into view port. This is the method signature `scrollInto(item: T) => void`.
| refreshList   | Method | Refresh the current items in the view port.


## Lazy Loading

The event `end` is fired every time scroll reaches at the end of the list. You could use this to load more items at the end of the scroll. See below.

```ts
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ChangeEvent } from 'angular-virtual-list';
...

@Component({
    selector: 'test-list',
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
    scrollList: ListItem[];

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

## Refresh current items

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
    scrollList = [];
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
        <virtual-list [source$]="items$" (update)="scrollList = $event">
            <div *ngFor="let item of scrollList; let i = index"> {{i}}: {{item}} </div>
        </virtual-list>
    `
})
export class ListComponent {

    items = ['Item1', 'Item2', 'Item3'];
    scrollList = [];
    items$ = Observable.of(this.items);

    @ViewChild(VirtualListComponent)
    private virtualList: VirtualListComponent;

    // call this function whenever you have to focus on second item
    focusOnAnItem() {
        this.virtualList.scrollInto(items[1]);
    }
}
```

## Demo
Take a look at these [example](https://aminpaks.github.io/angular-virtual-list/demo/dist/).

## Credits

Initial developer: [Rinto Jose](https://github.com/rintoj)