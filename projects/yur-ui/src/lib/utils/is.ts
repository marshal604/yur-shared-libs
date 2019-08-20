import { SimpleChange } from '@angular/core';

export function isPropertyOnChange(data: SimpleChange) {
  return data && !data.isFirstChange() && data.previousValue !== data.currentValue;
}
