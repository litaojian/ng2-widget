import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema } from '../biz-form';
import { SimpleTableColumn, SimpleTableButton, SimpleTableFilter, SimpleTableComponent } from '../biz-table';
import { BizDialogService } from './biz-dialog.service';
import { BizQueryService } from './biz-query.service';
import { BizPageComponent } from './biz-page.component';


@Component({
    selector: 'bizquery-dialog',
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
})
export class BizQueryDialogComponent extends BizPageComponent {

    @ViewChild('myDataTable')
    myDataTable: SimpleTableComponent;

    bizQueryService: BizQueryService;


    constructor(injector: Injector) {
        super(injector);
        //
        this.bizQueryService = injector.get(BizQueryService);
    }

    get dataTable(){
        return this.bizQueryService.dataTable;
    }

    get queryForm(){
        return this.bizQueryService.queryForm;
    }
    get actions(){
        return this.bizQueryService.actions;
    }
    onPageInit(resultData: any) {
        this.bizQueryService.onPageInit(resultData, this.router.url);
    }    

}
