import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualListComponent } from './virtual-list';

@NgModule({
  imports: [CommonModule],
  exports: [VirtualListComponent],
  declarations: [VirtualListComponent]
})
export class VirtualListModule { }
