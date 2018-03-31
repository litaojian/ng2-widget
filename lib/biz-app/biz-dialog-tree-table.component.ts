import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, Input, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService, NzModalSubject } from 'ng-zorro-antd';

import { BizTreeTableService } from './biz-tree-table.service';
import { BizDialogComponent } from './biz-dialog.component';
import { ZxTreeComponent } from '../my-tree';

@Component({
    selector: 'bizdialog-tree-table',
    styles:[`
        .pull-right {
            padding: 10px 16px 10px 10px;
            text-align: right;
        }
    `],
    template: `
    <div>
      <div nz-row [nzGutter]="24">
        <div nz-col [nzXl]="navTree.nzXl" [nzLg]="navTree.nzLg" [nzMd]="navTree.nzMd" [nzSm]="navTree.nzSm" [nzXs]="navTree.nzXs">
            <zx-tree #myNavTree tree-id="nTree1" (nodeClick)="onTreeNodeClick($event)" [has-checkbox]="navTree.checkbox" key-title="name" key-id="nodeId" key-pid="parentId" class="tree"></zx-tree>
        </div>
        <div nz-col [nzXl]="24 - navTree.nzXl" [nzLg]="24 - navTree.nzLg" [nzMd]="24 - navTree.nzMd" [nzSm]="16" [nzXs]="24">
            <my-simple-table #myDataTable [data]="dataTable.dataUrl" [extraParams]="queryParams" [columns]="dataTable.columns"
                [resReName]="dataTable.resReName" showTotal="dataTable.showTotal" [ps]="dataTable.pageSize" >
            </my-simple-table>
        </div>        
      </div>
      <div class="customize-footer pull-right">
        <button nz-button [nzType]="'primary'" [nzSize]="'large'" (click)="handleOk($event)">
          确定
        </button>
        <button nz-button [nzType]="'default'" [nzSize]="'large'" (click)="handleCancel($event)">
          取消
        </button>
      </div>
    </div>
    `,
    providers: [BizTreeTableService]
})
export class BizDialogTreeTableComponent extends BizDialogComponent {

    @ViewChild('myNavTree')
    myNavTree: ZxTreeComponent;

    _record:any;
    
    constructor(injector: Injector) {
        super(injector);
        //
        this.bizService = injector.get(BizTreeTableService);
        //
        console.log("BizDialogTreeComponent init .......");
    }

    @Input()
    set title(title: string) {
      //debugger;
      this.pageTitle = title;
    }

    @Input()
    set pageUrl(url: string) {
      //debugger;
      this.bizService.pageUrl = url;
    }

    @Input()
    set record(val: string) {
      //debugger;
      this._record = val;
    }


    get navTree(){
        return (<BizTreeTableService>this.bizService).navTree;
    }

    onPageInit(resultData: any, url:string) {
        //初始化配置数据
        this.bizService.onPageInit(resultData, url, this.actions);

        // 重新载入树的节点数据
        if (this.navTree){
            if (this._record){
                this.navTree.roleId = this._record.roleid;
            }
            this.myNavTree.loadTree(this.navTree);        
         }
    }    

    onTreeNodeClick(nodeId:string) {
    }

    handleOk(event:any) {
        let nodes:any = [];
        if (this.myNavTree){
            nodes = this.myNavTree.getSelectedNodes();
        }
        //
        this.subject.next({"data":nodes,"restUrl":this.navTree.dataUrl});
        this.subject.destroy('onOk');
    }
    
    handleCancel(event:any) {
        this.subject.destroy('onCancel');
    }

}
