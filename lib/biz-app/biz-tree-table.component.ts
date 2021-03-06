import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, ViewChild, HostBinding, Injector } from '@angular/core';
import { SimpleChanges, OnDestroy, OnInit, DoCheck } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema, FormProperty } from '../biz-form';
import { SimpleTableColumn, SimpleTableButton, SimpleTableFilter, SimpleTableComponent } from '../biz-table';
import { BizTreeTableService } from './biz-tree-table.service';
import { BizQueryService } from './biz-query.service';
import { BizQueryComponent } from './biz-query.component';
import { ZxTreeComponent } from '../my-tree';

@Component({
    selector: 'biz-tree-table',
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
                <div nz-col [nzXl]="navTree.nzXl" [nzLg]="navTree.nzLg" [nzMd]="navTree.nzMd" [nzSm]="navTree.nzSm" [nzXs]="navTree.nzXs">
                    <zx-tree #myNavTree tree-id="menuTree2" (nodeClick)="onTreeNodeClick($event)" has-checkbox="false" key-title="name" key-id="nodeId" key-pid="parentId" class="tree"></zx-tree>
                </div>
                <div nz-col [nzXl]="24 - navTree.nzXl" [nzLg]="24 - navTree.nzLg" [nzMd]="24 - navTree.nzMd" [nzSm]="16" [nzXs]="24">
                    <my-simple-table #myDataTable [data]="dataTable.dataUrl" [extraParams]="queryParams" [columns]="dataTable.columns"
                        [resReName]="dataTable.resReName" showTotal="dataTable.showTotal" [ps]="dataTable.pageSize" >
                    </my-simple-table>
                </div>
            </div>
        </ng-template>
    </nz-card> 

    
    `,
    providers: [BizQueryService, BizTreeTableService]
})
export class BizTreeTableComponent extends BizQueryComponent implements OnInit, DoCheck , OnDestroy {
    
    @ViewChild('myNavTree')
    myNavTree: ZxTreeComponent;


    constructor(injector: Injector) {
        super(injector);

        this.bizService = injector.get(BizTreeTableService);
        //
        console.log("BizTreeTableComponent init ..............");
    }

    get navTree(){
        return (<BizTreeTableService>this.bizService).navTree;
    }

    get selectNodeId(){
        return (<BizTreeTableService>this.bizService).selectNodeId;
    }
    
    set selectNodeId(nodeId){
        (<BizTreeTableService>this.bizService).selectNodeId = nodeId;
    }
    //     
    onPageInit(resultData: any, url:string) {
         //初始化配置数据
         this.bizService.onPageInit(resultData, url, this.actions);

         // 重新载入树的节点数据
         if (this.navTree){
            this.myNavTree.loadTree(this.navTree);        
         }
    }

    onTreeNodeClick(nodeId:string) {
        //console.log("selected node :" + nodeId);
        this.activatedRoute.snapshot.data['parentId'] = nodeId;
        this.queryParams['parentId'] = nodeId;
        this.selectNodeId = nodeId;        

        //console.log("queryParams", this.queryParams);
        // 表格依据查询参数重新载入数据
        this.myDataTable.load(1);
        return false;
    }

    onAddNew(params?: any): void {
        if (!params){
            params = {};
        }
        params.parentid =  this.selectNodeId;
        return super.onAddNew(params);
    }    
}
