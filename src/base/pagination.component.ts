import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
declare var $:any;

const PAGESIZEOPTIONS = [5, 10, 15, 20, 30, 40, 50, 75, 100];

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styles: [`
    .pagination {
      width: 100%;
      background: #f9f9f9;
      padding-right: 5px;
      border: 1px solid #dfe3e9;
      margin-bottom: 0;
      height: 40px;
      line-height: 40px;
      color: #999;
      text-align: right;
    }

    .pagination .dropdown {
      display: inline-block;
    }
    .pagination .dropdown > a {
      padding: 0 5px;
      margin-right: 4px;
      display: inline-block;
      color: #555;
    }
    .pagination .dropdown>a:hover {
      background: #e3e3e3;
      text-decoration: none;
    }
    .pagination .dropdown>a:focus {
      text-decoration: none;
    }
    .pagination .dropdown-menu {
      margin-top: 0;
      width: 212px;
      margin-left: -5px;
      padding: 0;
    }
    .pagination .dropdown-menu>li {
      display: block;
      float: left;
      width: 70px;
      border-right: 1px dotted #ddd;
      border-bottom: 1px dotted #ddd;
    }
    .pagination .dropdown-menu>li>a {
      display: block;
      font-size: 12px;
      padding: 5px 25px 5px 15px;
      clear: both;
      font-weight: 400;
      line-height: 1.42857143;
      color: #333;
      white-space: nowrap;
    }
    .pagination .dropdown-menu>.selected>a,
    .pagination .dropdown-menu>.selected>a:hover,
    .pagination .dropdown-menu>.selected>a:active {
      background: #f1f1f1!important;
      font-weight: bold;
      color: #333!important;
    }
    .pagination .dropdown-menu>.selected {
        position: relative;
    }
    .pagination .dropdown-menu>.selected>a:before {
      content: "\\e60d";
      font-family: ZenIcon;
      font-size: 14px;
      position: absolute;
      right: 8px;
      top: 4px;
      display: block;
      color: #808080;
      font-weight: normal;
    }
    .pagination .text-pager {
      padding: 0 2px;
      display: inline-block;
    }
    .pagination .text-pager a {
      margin-left: 2px;
      margin-right: 2px;
      color: #555;
    }
    .pagination .text-pager a:hover,
    .pagination .text-pager a:focus:hover {
      text-decoration: underline;
    }
    .pagination .text-pager a:focus {
      text-decoration: none;
    }
    .pagination .text-pager a.disabled {
      color: #999;
    }
    .pagination .text-pager a.disabled:hover {
      text-decoration: none;
    }
    .pagination input {
      width: 35px;
      height: 22px;
      display: inline-block;
      text-align: center;
    }
    .pagination input,
    .pagination .btn {
      vertical-align: baseline;
    }
  `]
})
export class PaginationComponent implements OnInit {
  @Input() pageIndex:number = 1;
  @Output() pageIndexChange = new EventEmitter<number>();
  @Input() pageSize:number = 10;
  @Output() pageSizeChange = new EventEmitter<number>();

  jumpPage:string;
  _totalItems:number;
  totalPage:number;

  @Input()
  set totalItems(val: number) {
    this._totalItems = val;
    this.totalPage = Math.ceil(this._totalItems / this.pageSize) || 1;
  }
  get totalItems(): number {
    return this._totalItems;
  }
  
  @Output() onPageChange = new EventEmitter<any>();

	pageSizeOptions = PAGESIZEOPTIONS;

  constructor() { }

  ngOnInit() {
    this.totalPage = Math.ceil(this._totalItems / this.pageSize) || 1;
  }

  ngAfterViewInit() {
  	$('app-pagination [data-toggle="dropdown"]').dropdown();
  }

  noPrev() {
    return this.pageIndex <= 1;
  }

  noNext() {
    return this.pageIndex >= this.totalPage;
  }

  selectPage(val) {
    var page = parseInt(val);
    this.jumpPage = '';

    if (page < 1 || page > this.totalPage || isNaN(page)) return;

  	this.pageIndex = page;
    this.pageIndexChange.emit(page);

    this.onPageChange.emit({  // 执行回调
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    });
  }

  selectPageSize(val) {
  	this.pageSize = val;
    this.pageSizeChange.emit(val);
    this.totalPage = Math.ceil(this.totalItems / this.pageSize);

    this.selectPage(1);
  }
}
