import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema, FormProperty } from '../biz-form';
import { SimpleTableColumn, SimpleTableButton, SimpleTableFilter, SimpleTableComponent } from '../biz-table';
import { BizQueryService } from './biz-query.service';
import { BizQueryComponent } from '@yg-widget';

import { ITreeOptions } from 'angular-tree-component';

@Component({
    selector: 'biz-tree-table',
    template: `
    <div class="mb-md">
        <p>tree panel</p>
    </div>
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
export class BizTreeTableComponent extends BizQueryComponent implements OnInit, OnDestroy {

    treeOptions: ITreeOptions = {
        idField: '',
        displayField: '',
        childrenField: 'children'
    };

    treeNodes: any[] = [];//保存树的数据

    constructor(injector: Injector) {
        super(injector);
        //
        console.log("BizTreeTableComponent init ..............");
    }

}
