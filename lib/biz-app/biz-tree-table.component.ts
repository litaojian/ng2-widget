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
        <nz-input [(ngModel)]="queryParams.testname" name="name" nzPlaceHolder="请输入姓名" style="width: 100px"></nz-input>
        <button nz-button (click)="st.load(1)" [nzType]="'primary'">搜索</button>
        <button nz-button (click)="params = {}; st.reset()">重置</button>
        <!--  -->
        <button nz-button (click)="st.export()">Export</button>
    </div>
    <div nz-row [nzGutter]="24">
        <div nz-col nzMd="4" nzSm="12" nzXs="24">
            <zx-tree #myNavTree tree-id="menuTree2" (nodeClick)="onTreeNodeClick($event)" has-checkbox="false" key-title="name" key-id="nodeId" key-pid="parentId" class="tree"></zx-tree>
        </div>
        <div nz-col nzMd="16" nzSm="16" nzXs="24">
            <simple-table #st [data]="dataTable.dataUrl" [extraParams]="params" [total]="10" [columns]="dataTable.columns" [resReName]="dataTable.resReName" showTotal="dataTable.showTotal">
            </simple-table>
        </div>
    </div>
    `,
    providers: []
})
export class BizTreeTableComponent extends BizQueryComponent implements OnInit, OnDestroy {

    @ViewChild('myNavTree')
    myNavTree: ZxTreeComponent;

    treeOptions: ITreeOptions = {
        idField: '',
        displayField: '',
        childrenField: 'children'
    };
    //保存树的数据
    _treeNodes: any[] = []; 
    
    navTree: any = {
        dataUrl: ''
    }
    
    constructor(injector: Injector) {
        super(injector);
        //
        console.log("BizTreeTableComponent init ..............");
    }

    get treeNodes(){
        return this._treeNodes;
    }
    set treeNodes(treeNodes:any[]){
        this._treeNodes = treeNodes;
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
        //this.myDataTable.load(1);
        return false;
    }
}
