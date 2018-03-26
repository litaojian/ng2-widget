import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BizPageService } from './biz-page.service';

@Injectable()
export class BizQueryService extends BizPageService {

	pagePath: string;
    selectedRow: Object;
    pageIndex: number = 1;
    //pageSize: number = 10;

    queryParams: any = {};
    _queryParams:any = [];

    queryForm: any = {
        layout: "inline",
        schema: null,
        model: {}
    };

    dataTable: any = {
        nzXs:18,
        nzSm:12,
        nzMd:6,
        nzLg:6,
        nzXl:4,
        dataUrl: '',
        reqMehtod: "GET",
        showTotal: true,
        resReName: { list: 'rows', total: 'total' },
        columns: [
            { title: "ID" }
        ]
    }
	
	actions: any = {
        reset: (form: any) => {
            form.reset({});
		}
	};
	
	constructor(injector: Injector) {
		super(injector);

		//this.setApiUrl(apiUrl);
		//this.setIdField(idField);
	}

	//     
	onPageInit(resultData: any, pageUrl:string) {

		if (this.reuseTabService) {
			this.reuseTabService.title = resultData["title"];
		}

		Object.keys(resultData["dataTable"]).forEach((propKey: string) => {
			this.dataTable[propKey] = resultData["dataTable"][propKey];
		});

		if (resultData["dataTable"]["dataUrl"]) {
			this.dataTable.dataUrl = this.formatUrl(this.dataTable.dataUrl);
		} else {
			this.dataTable.dataUrl = this.formatUrl(resultData.restAPI);
		}
		this.dataTable.columns.forEach((column: any) => {
			if (column["buttons"]) {
				column["buttons"].forEach((button: any) => {
					button["click"] = this.actions[button["click"]];
				});
			}
		});

		if (resultData["queryForm"]) {
			this.queryForm.schema = {};
			this.queryForm.layout = resultData["queryForm"].layout || "inline";
			Object.keys(resultData["queryForm"]).forEach((propKey: string) => {
				this.queryForm.schema[propKey] = resultData["queryForm"][propKey];
			});
		}

		Object.keys(resultData["actions"]).forEach((propKey: string) => {
			this.actions[propKey] = resultData["actions"][propKey];
		});

		this.queryParams = {};
		Object.keys(resultData["queryParams"]).forEach((propKey: string) => {
			this.queryParams[propKey] = resultData["queryParams"][propKey];
		});
		this.queryForm.modal = this.queryParams;
		Object.assign(this._queryParams, this.queryParams);

		this.setApiUrl(resultData.restAPI);
		this.setIdField(resultData.idField);
		//set the view url
		this.setPageViewUrl(pageUrl, "list");

	}
}
