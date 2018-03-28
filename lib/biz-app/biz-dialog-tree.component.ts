import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, Input, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService, NzModalSubject } from 'ng-zorro-antd';

import { BizTreeService } from './biz-tree.service';
import { BizDialogComponent } from './biz-dialog.component';
import { ZxTreeComponent } from '../my-tree';

@Component({
    selector: 'bizdialog-tree',
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
    providers: [BizTreeService]
})
export class BizDialogTreeComponent extends BizDialogComponent {

    @ViewChild('myNavTree')
    myNavTree: ZxTreeComponent;
    
    constructor(injector: Injector) {
        super(injector);
        //
        this.bizService = injector.get(BizTreeService);
        //
        console.log("BizDialogTreeComponent init .......");
    }

    @Input()
    set pageUrl(url: string) {
      //debugger;
      this.bizService.pageUrl = url;
    }

    @Input()
    set title(title: string) {
      //debugger;
      this.pageTitle = title;
    }

    get navTree(){
        return (<BizTreeService>this.bizService).navTree;
    }

    onPageInit(resultData: any, url:string) {
        //初始化配置数据
        this.bizService.onPageInit(resultData, url, this.actions);

        // 重新载入树的节点数据
        if (this.navTree){
            this.myNavTree.loadTree(this.navTree);        
         }
    }    

    onTreeNodeClick(nodeId:string) {
    }

    handleOk() {
        let data:any = [];
        if (this.myNavTree){
            data = this.myNavTree.saveSelectNodes(this.navTree);
        }
        this.subject.destroy('onOk');
    }
    
    handleCancel(event:any) {
        this.subject.destroy('onCancel');
    }

}
