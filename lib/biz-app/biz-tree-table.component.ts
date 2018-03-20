import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema, FormProperty } from '../biz-form';
import { SimpleTableColumn, SimpleTableButton, SimpleTableFilter, SimpleTableComponent } from '../biz-table';
import { BizQueryService } from './biz-query.service';
import { BizQueryComponent } from './biz-query.component';
import { ZxTreeComponent } from '../my-tree';

import { ITreeOptions } from 'angular-tree-component';

@Component({
    selector: 'biz-tree-table',
    template: `
    <div class="mb-md">
        <my-simple-form #myQueryForm [layout]="queryForm.layout"
            [schema]="queryForm.schema"
            [model]="queryForm.model"
            [actions]="actions">
        </my-simple-form>
    </div>
    <div nz-row [nzGutter]="24">
        <div nz-col nzMd="4" nzSm="12" nzXs="24">
            <zx-tree #myNavTree tree-id="menuTree2" (nodeClick)="onTreeNodeClick($event)" has-checkbox="false" key-title="name" key-id="nodeId" key-pid="parentId" class="tree"></zx-tree>
        </div>
        <div nz-col nzMd="16" nzSm="16" nzXs="24">
            <my-simple-table #myDataTable [data]="dataTable.dataUrl" [extraParams]="queryParams" [columns]="dataTable.columns"
                [resReName]="dataTable.resReName" showTotal="dataTable.showTotal" [ps]="dataTable.pageSize" >
            </my-simple-table>
        </div>
    </div>
    `,
    providers: []
})
export class BizTreeTableComponent extends BizQueryComponent implements OnInit, OnDestroy {
    
    @ViewChild('myNavTree')
    myNavTree: ZxTreeComponent;

    navTree: any = {
        dataUrl: ''
    }

    constructor(injector: Injector) {
        super(injector);
        //
        console.log("BizTreeTableComponent init ..............");
    }


    //     
    onPageInit(resultData: any) {
        //
        super.onPageInit(resultData);

        if (resultData["navTree"]){
            
            Object.keys(resultData["navTree"]).forEach((propKey: string) => {
                this.navTree[propKey] = resultData["navTree"][propKey];
            });
            
            if (this.navTree.dataUrl) {
                this.navTree.dataUrl = this.bizService.formatUrl(this.navTree.dataUrl);
            }    
            // 重新载入树的节点数据
            this.myNavTree.loadTree(this.navTree.dataUrl);
        }
    }

    onTreeNodeClick(nodeId:string) {
        console.log("selected node :" + nodeId);
        this.activatedRoute.snapshot.data['parentId'] = nodeId;
        this.queryParams['parentId'] = nodeId;        

        console.log("queryParams", this.queryParams);
        // 表格依据查询参数重新载入数据
        this.myDataTable.load(1);
        return false;
    }

}
