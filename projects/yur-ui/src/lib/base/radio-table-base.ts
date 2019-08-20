import { Output, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

import { TableBase } from './table-base';

export abstract class RadioTableBase extends TableBase {
  @Output() radioChange = new EventEmitter<any>();
  radioSelection: SelectionModel<any>;

  constructor() {
    super();
  }
  abstract headersMap: Map<string, string>;
  abstract parseRowWordsFn(row: any, header: string): Array<string | number>;
  onRadioBoxChange(row: any) {
    this.radioSelection.toggle(row);
    this.radioChange.emit(this.radioSelection.selected[0]);
  }

  initSelection() {
    super.initSelection();
    this.radioSelection = new SelectionModel(false, []);
  }

  resetSelection() {
    super.resetSelection();
    this.radioSelection.clear();
  }
}
