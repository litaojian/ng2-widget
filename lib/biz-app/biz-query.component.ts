import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema, FormProperty } from '../biz-form';
import { SimpleTableColumn, SimpleTableButton, SimpleTableFilter, SimpleTableComponent } from '../biz-table';
import { BizQueryService } from './biz-query.service';
import { BizPageComponent } from './biz-page.component';

@Component({
    selector: 'app-biz-query',
    template: `
    <div class="mb-md">
        <my-simple-form #myQueryForm [layout]="queryForm.layout"
                [schema]="queryForm.schema"
                [model]="queryForm.model"
                [actions]="actions">
        </my-simple-form>
    </div>
    <my-simple-table #myDataTable [data]="dataTable.dataUrl" [extraParams]="queryParams" [columns]="dataTable.columns"
        [resReName]="dataTable.resReName" showTotal="dataTable.showTotal" [ps]="dataTable.pageSize" >
    </my-simple-table>
    `,
    providers: []
})
export class BizQueryComponent extends BizPageComponent implements OnInit, OnDestroy {

    @ViewChild('myDataTable')
    myDataTable: SimpleTableComponent;

    pagePath: string;
    selectedRow: Object;
    pageIndex: number = 1;
    //pageSize: number = 10;

    actions: any = {
        reset: (form: any) => {
            form.reset({});
        },
        query: (form: any) => {
            //this.msg.success(JSON.stringify(form.value));
            this.onQuery(form.value);
        },
        add: (form: any) => {
            this.onAddNew(form.value);
        },
        delete: (row: any) => {
            this.onDeleteRow(row);
        },
        edit: (row: any) => {
            this.onEditRow(row);
        },
        view: (row: any) => {
            this.onViewRow(row);
        }
    };

    queryParams: any = {};

    queryForm: any = {
        layout: "inline",
        schema: null,
        model: {}
    };

    dataTable: any = {
        dataUrl: '',
        reqMehtod: "GET",
        showTotal: true,
        resReName: { list: 'rows', total: 'total' },
        columns: [
            { title: "ID" }
        ]
    }


    constructor(injector: Injector) {
        super(injector);
        console.log("BizQueryComponent init ..............");
    }

    //     
    onPageInit(resultData: any) {

        if (this.reuseTabService) {
            this.reuseTabService.title = resultData["title"];
        }

        Object.keys(resultData["dataTable"]).forEach((propKey: string) => {
            this.dataTable[propKey] = resultData["dataTable"][propKey];
        });

        if (this.dataTable.dataUrl) {
            this.dataTable.dataUrl = this.bizService.formatUrl(this.dataTable.dataUrl);
        } else {
            this.dataTable.dataUrl = this.bizService.formatUrl(resultData.restAPI);
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

        Object.keys(resultData["queryParams"]).forEach((propKey: string) => {
            this.queryParams[propKey] = resultData["queryParams"][propKey];
        });
        this.queryForm.modal = this.queryParams;

        this.bizService.setApiUrl(resultData.restAPI);
        this.bizService.setIdField(resultData.idField);
        //set the view url
        this.bizService.setPageViewUrl(this.router.url, "list");

        //console.log("page def:" , this.queryForm);
    }
    //
    onQuery(form: any): void {
        Object.keys(form).forEach((formField: string) => {
            this.queryParams[formField] = form[formField];
        });
        console.log("queryParams", this.queryParams);
        // 表格依据查询参数重新载入数据
        this.myDataTable.load(1);
    }

    ngOnDestroy() {
        //console.log(" bizQuery ngOnDestory......");				
    }


    onDeleteRow(row: any): void {
        if (confirm("是否要删除此条数据?")) {
            //debugger;
            this.bizService.delete(row[this.bizService.getIdField()])
                .subscribe((result: any) => {
                    console.log("debug:" + JSON.stringify(result));
                    if (result == null || result["resultCode"] == 0) {
                        this.myDataTable.load();
                    } else {
                        alert(result["resultMsg"]);
                    }
                });
        }
    }

    onAddNew(params?: any): void {
        // 保存返回状态参数
        this.saveCurrentState();

        if (params == null) {
            params = {};
        }

        let keys = Object.keys(params);
        for (let i = 0; i < keys.length; i++) {
            let paramVal: string = params[keys[i]];
            //console.log("debug:" + keys[i] + "=" + params[keys[i]]);
            if (typeof (paramVal) === 'string' && paramVal.startsWith("${") && paramVal.endsWith("}")) {
                let varName = paramVal.replace("${", "").replace("}", "");
                params[keys[i]] = this.activatedRoute.snapshot.data[varName];
            }
        }

        params["backtoUrl"] = this.bizService.base64Encode(this.router.url);
        let url = this.bizService.getUrl(this.bizService.getContextPath(this.router.url) + this.bizService.getFormViewUrl());
        this.router.navigate([url, 'create'], { queryParams: params });
    }

    onEditRow(row: Object): void {
        // debugger;
        this.selectedRow = row;
        let url = this.bizService.getUrl(this.bizService.getContextPath(this.router.url) + this.bizService.getFormViewUrl());
        let rowId = this.bizService.getValue(row, this.bizService.getIdField());
        this.router.navigate([url, 'edit'], { queryParams: { 'id': rowId } });
        //console.log("edit the row:" + row);
    }

    onViewRow(row: Object): void {
        //debugger;
        this.selectedRow = row;
        let url = this.bizService.getUrl(this.bizService.getContextPath(this.router.url) + this.bizService.getFormViewUrl());
        let rowId = this.bizService.getValue(row, this.bizService.getIdField());
        this.router.navigate([url, 'view'], { queryParams: { 'id': rowId } });
        //console.log(" show the row:" + row);
    }

    saveCurrentState() {
        let currentStateParams: any = {};
        currentStateParams["parentId"] = this.activatedRoute.snapshot.data['parentId'];
        currentStateParams["pageIndex"] = this.pageIndex;
        currentStateParams["queryForm"] = this.queryForm;

        let path = this.router.url.replace(/\//gi, "_");
        let pos = path.indexOf("?");
        if (pos > 0) {
            path = path.substring(0, pos);
        }
        this.bizService.storeCookie(path, JSON.stringify(currentStateParams));

    }

    restoreCurrentState() {
        //debugger;
        console.log(this.router.url + " restoreCurrentState start.....")
        let path = this.router.url.replace(/\//gi, "_");
        let pos = path.indexOf("?");
        if (pos > 0) {
            path = path.substring(0, pos);
        }
        let value = this.bizService.loadCookie(path);
        if (value != null) {
            let currentStateParams = JSON.parse(value);
            this.activatedRoute.snapshot.data['parentId'] = currentStateParams["parentId"];
            this.dataTable.pageSize = currentStateParams["pageSize"];
            this.queryForm = currentStateParams["queryForm"];
        }
    }





}
