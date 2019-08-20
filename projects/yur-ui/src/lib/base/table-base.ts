import {
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { isPropertyOnChange } from '@yur-ui-utils/is';

export abstract class TableBase implements OnInit, OnChanges {
  @Input() data: any[];
  @Input() headers: string[];
  @Input() filterStr: string;
  @Output() clickRow = new EventEmitter<{ row: any }>();
  @Output() clickCell = new EventEmitter<{ row: any; header: string }>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  expandSelection: SelectionModel<any>;
  constructor() {}
  abstract headersMap: Map<string, string>;
  abstract parseRowWordsFn(row: any, header: string): Array<string | number>;
  ngOnInit() {
    this.initSelection();
    this.initDataSource();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (isPropertyOnChange(changes.data)) {
      this.dataSource.data = changes.data.currentValue;
    }

    if (isPropertyOnChange(changes.filterStr)) {
      this.dataSource.filter = changes.filterStr.currentValue;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  onCellClicked(row: any, header: string) {
    this.clickCell.emit({ row, header });
  }

  onRowClicked(row: any) {
    this.expandSelection.toggle(row);
    this.clickRow.emit(row);
  }
  initSelection() {
    this.expandSelection = new SelectionModel(true, []);
  }

  initDataSource() {
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.sort = this.sort;
    this.dataSource.filter = this.filterStr;
    this.dataSource.filterPredicate = (data, filterStr) => {
      return this.headers
        .reduce((pre, header) => pre.concat(this.parseRowWordsFn(data, header)), [])
        .filter(str => !(str === '-' || str === null || str === undefined))
        .some(str =>
          str
            .toString()
            .toLowerCase()
            .includes(filterStr)
        );
    };
    this.dataSource.sortingDataAccessor = (data, header) => {
      return this.parseRowWordsFn(data, header)[0];
    };
  }

  resetSelection() {
    this.expandSelection.clear();
  }
}
