import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

@Component({
	selector: 'my-table',
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

	@Input()
	schema: Object;

	@Output()
	goPageEvent: EventEmitter<any> = new EventEmitter();

	@Input()
	pageIndex: number = 1;

	@Input()
	pageSize: number = 10;

	@Input()
	totalCount: number = 0;

	@Input()
	tableData: Object[] = [];

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

	_get(item: any, col: any) {
		if (col.format) return col.format(item, col);

		const ret = this.deepGet(item, col.index as string[], '');
		if (typeof ret === 'undefined') return '';

		// switch (col.type) {
		//     case 'img':
		//         return `<img src="${ret}" class="img">`;
		//     case 'currency':
		//         return this.currenty.transform(ret);
		//     case 'date':
		//         return this.date.transform(ret, col.dateFormat);
		//     case 'yn':
		//         return this.yn.transform(ret === col.ynTruth, col.ynYes, col.ynNo);
		// }
		return ret;
	}



	/**
	 * 类似 `_.get`，根据 `path` 获取安全值
	 * jsperf: https://jsperf.com/es-deep-get
	 */
	deepGet(obj: any, path: string[], defaultValue: any) {
		if (!obj) return defaultValue;
		if (path.length <= 1) {
			const checkObj = path.length ? obj[path[0]] : obj;
			return typeof checkObj === 'undefined' ? defaultValue : checkObj;
		}
		return path.reduce((o, k) => (o || {})[k], obj) || defaultValue;
	}

}
