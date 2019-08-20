import { Output, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

import { TableBase } from './table-base';

export abstract class CheckTableBase extends TableBase {
  @Output() checkChange = new EventEmitter<any[]>();
  checkSelection: SelectionModel<any>;
  constructor() {
    super();
  }
  abstract headersMap: Map<string, string>;
  abstract parseRowWordsFn(row: any, header: string): Array<string | number>;

  onCheckboxChange(row: any) {
    this.checkSelection.toggle(row);
    this.checkChange.emit(this.checkSelection.selected);
  }

  initSelection() {
    super.initSelection();
    this.checkSelection = new SelectionModel(false, []);
  }

  resetSelection() {
    super.resetSelection();
    this.checkSelection.clear();
  }
}
