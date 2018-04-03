import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, ViewChild, HostBinding, Injector } from '@angular/core';
import { SimpleChanges, OnDestroy, OnInit, DoCheck } from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema, FormProperty } from '../biz-form';
import { SimpleTableColumn, SimpleTableButton, SimpleTableFilter, SimpleTableComponent } from '../biz-table';
import { BizQueryService } from './biz-query.service';
import { BizPageComponent } from './biz-page.component';
import { BizDialogQueryComponent } from './biz-dialog-query.component';
import { BizDialogFormComponent } from './biz-dialog-form.component';
import { BizDialogTreeComponent } from './biz-dialog-tree.component';

export const DIALOGTYPES = [
    BizDialogQueryComponent,
    BizDialogFormComponent,
	BizDialogTreeComponent
];


@Component({
    selector: 'app-biz-query',
    template: `
    <div class="content__title" style="display: none;">
      <h1>
        {{pageTitle}}
      </h1>
    </div>    
    <nz-card [nzBordered]="false" [nzNoHovering]="true">
      <ng-template #body>
        <div class="mb-md">
            <my-simple-form #myQueryForm [layout]="queryForm.layout"
                    [schema]="queryForm.schema"
                    [model]="queryForm.model"
                    [actions]="actions">
            </my-simple-form>
        </div>
        <div nz-row [nzGutter]="24">
            <div nz-col nzMd="24" nzSm="24" nzXs="24">
                <my-simple-table #myDataTable [data]="dataTable.dataUrl" [extraParams]="queryParams" [columns]="dataTable.columns"
                    [resReName]="dataTable.resReName" showTotal="dataTable.showTotal" [ps]="dataTable.pageSize" >
                </my-simple-table>
            </div>
        </div>
      </ng-template>
    </nz-card> 

    `,
    providers: [BizQueryService]
})
export class BizQueryComponent extends BizPageComponent implements OnInit, DoCheck, OnDestroy {

    @ViewChild('myDataTable')
    myDataTable: SimpleTableComponent;

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
        },
        dialogConfirm: (row: any, modal: any) => {
            console.log("debugger dialogConfirm..........." + modal);

            let roleId = row.roleid;
            if (modal != null && modal.restUrl){
                let nodes:any = modal.data;
                let restUrl = modal.restUrl;
                let result = this.bizService.ajaxPut(restUrl, {"roleId":roleId,"data":nodes}).subscribe(result =>{
                    console.log("ajaxPost:" + JSON.stringify(result));
                });    
            }
        }
    };

    
    constructor(injector: Injector) {
        super(injector);
        //
        this.bizService = injector.get(BizQueryService);
        console.log("BizQueryComponent init ..............");
    }

    get dataTable(){
        return (<BizQueryService>this.bizService).dataTable;
    }

    get queryForm(){
        return (<BizQueryService>this.bizService).queryForm;
    }

    get queryParams(){
        return (<BizQueryService>this.bizService).queryParams;
    }    

    set queryParams(params){
        (<BizQueryService>this.bizService).queryParams = params;
    }

    get defaultQueryParams(){
        return (<BizQueryService>this.bizService).defaultQueryParams;
    }    

    set defaultQueryParams(params){
        (<BizQueryService>this.bizService).defaultQueryParams = params;
    }

    //     
    onPageInit(resultData: any, url:string) {
        this.bizService.onPageInit(resultData, url, this.actions);
        // 设置弹窗组件
        this.dataTable.columns.forEach((column: any) => {
			if (column.buttons){
                column.buttons.forEach((button: any) => {
                    if (button.component == 'BizDialogQueryComponent'){
                        button.component = DIALOGTYPES[0];
                        button.params = (record:any) =>{ 
                            return record;
                        };
                    }else if (button.component == 'BizDialogFormComponent'){
                        button.component = DIALOGTYPES[1];
                        button.params = (record:any) =>{return record;};
                    }else if (button.component == 'BizDialogTreeComponent'){
                        button.component = DIALOGTYPES[2];
                        // button.modalOptions.onOk = ()=>{
                        //     console.log("onOk button click..................");
                        //     debugger;
                        // };
                        button.params = (record:any) =>{ 
                            record.pageUrl = button['dialogUrl']; 
                            record.title = button['text'];                             
                            return record;
                        };
                    }                    
                });				
			}
        });  
        //
        console.log("BizQueryComponent onPageInit ..............");
    }
    //
    onQuery(form: any): void {
        Object.keys(this.queryParams).forEach((prop: string) => {
            if (this.defaultQueryParams[prop] != null){
                this.queryParams[prop] = this.defaultQueryParams[prop];
            }else{
                delete this.queryParams[prop];
            }            
        });
        Object.keys(form).forEach((formField: string) => {
            this.queryParams[formField] = form[formField];
        });
        console.log("queryParams", this.queryParams);
        // 表格依据查询参数重新载入数据
        this.myDataTable.load(1);
    }

    ngOnDestroy() {
        //debugger;
        //console.log(" bizQuery ngOnDestory......");	
        this.myDataTable = null;			
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
    /**
     * 
     * @param row 
     */
    onShowQueryDialog(row: Object): void {
        //alert('aaa');
        let size: '' | 'lg' | 'sm' = '';
        size = 'lg';
        let options = {
            wrapClassName: size ? 'modal-' + size : '',
            content: BizDialogQueryComponent,
            footer: false,
            componentParams: {
                pageUrl:'/demo/testDialog',
                name: 'From Parent Data'
            }
        };
        this.modalService.open(options).subscribe(result => {
            //this.msg.info(`subscribe status: ${JSON.stringify(result)}`);
        });
    }

    onShowTreeDialog(row: Object): void {
        //alert('aaa');
        let size: '' | 'lg' | 'sm' = '';
        size = 'lg';
        let options = {
            wrapClassName: size ? 'modal-' + size : '',
            content: BizDialogTreeComponent,
            footer: false,
            componentParams: {
                pageUrl:'/admin/userTree'
            }
        };
        this.modalService.open(options).subscribe(result => {
            //this.msg.info(`subscribe status: ${JSON.stringify(result)}`);
        });
    }

    saveCurrentState() {
        let currentStateParams: any = {};
        currentStateParams["parentId"] = this.activatedRoute.snapshot.data['parentId'];
        currentStateParams["pageIndex"] = this.pageIndex;
        currentStateParams["queryParams"] = this.queryParams;

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
            this.queryParams = currentStateParams["queryParams"];
        }
    }

}
