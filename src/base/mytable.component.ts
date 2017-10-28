import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

@Component({
	selector: 'my-table',
	//moduleId: module.id,
	templateUrl: './mytable.component.html',
	styles: [`
		.table-foot-toolbar {
			padding: 0px 0px;
		}
	`]
})

export class MyTableComponent {
	@Input()
	title: string;

	@Output()
	public goPageEvent: EventEmitter<any> = new EventEmitter();

	@Input()
	pageIndex: number = 1;

	@Input()
	pageSize: number = 10;

	@Input()
	totalCount: number = 0;

	constructor() {
		//console.log("MyTableComponent init:" + this.tableData);
	}
	onPageChange(any) {
		this.goPageEvent.emit(any);
	}

	getPageIndex() {
		return this.pageIndex;
	}

	getPageSize() {
		return this.pageSize;
	}

	setPageIndex(pageIndex: number) {
		this.pageIndex = pageIndex;
	}

	setPageSize(pageSize: number) {
		this.pageSize = pageSize;
	}

	// setPageCount(pageCount: number) {
	// 	this.pageCount = pageCount;
	// }

	setTotalCount(total: number) {
		this.totalCount = total;
		// this.pageCount = Math.ceil(this.total / this.pageSize);
	}
}
