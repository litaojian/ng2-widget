import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, Input, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema } from '../biz-form';
import { SimpleTableColumn, SimpleTableButton, SimpleTableFilter, SimpleTableComponent } from '../biz-table';
import { BizDialogService } from './biz-dialog.service';
import { BizQueryService } from './biz-query.service';
import { BizDialogComponent } from './biz-dialog.component';


@Component({
    selector: 'bizdialog-query',
    template: `
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
    `,
    providers: [BizQueryService]
})
export class BizDialogQueryComponent extends BizDialogComponent {

    @ViewChild('myDataTable')
    myDataTable: SimpleTableComponent;

    @Input()
    set pageUrl(url: string) {
      this.bizService.pageUrl = url;
    }
    

    constructor(injector: Injector) {
        super(injector);
        //
        this.bizService = injector.get(BizQueryService);
    }

    get dataTable(){
        return (<BizQueryService>this.bizService).dataTable;
    }

    get queryForm(){
        return (<BizQueryService>this.bizService).queryForm;
    }
        
    onPageInit(resultData: any, url:string) {
        this.bizService.onPageInit(resultData, this.pageUrl, this.actions);
    }    

}
