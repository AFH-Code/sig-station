import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sp-pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnInit {
  @Input() config!: any;
  @Input() type!: string;
  @Output() onChangePage: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    
  }

  onPageChange(event: any): void {
    this.onChangePage.emit(event);
  }

  convertNumber(value: any): number {
    return Number(value);
  }

  calculNumberPage(): string {
    let debut = 1;
    let fin = 1;

    if (Number(this.config.currentPage) === 1) {
      debut = 1;
    } else {
      debut =
        (Number(this.config.currentPage) - 1) *
          Number(this.config.itemsPerPage) +
        1;
    }

    if (Number(this.config.currentPage) === 1) {
      fin = this.config.itemsPerPage;
    } else if (debut > Number(this.config.totalItems)) {
      fin = this.config.totalItems;
    } else {
      fin = debut + Number(this.config.itemsPerPage);
    }

    if (fin > Number(this.config.totalItems)) {
      fin = this.config.totalItems;
    }

    return (
      debut +
      ' - ' +
      fin +
      ' ' +
      'Sur' +
      ' ' +
      this.config.totalItems
    );
  }
}
