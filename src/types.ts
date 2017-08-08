export interface ChangeEvent {
  start?: number;
  end?: number;
}

export interface Dimensions {
  itemCount: number;
  viewWidth: number;
  viewHeight: number;
  childWidth: number;
  childHeight: number;
  itemsPerRow: number;
  itemsPerCol: number;
  itemsPerRowByCalc: number;
}
