import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SimpleTableColumn, SimpleTableButton, SimpleTableFilter, SimpleTableComponent } from '../biz-table';
import { BizPageService } from './biz-page.service';
import { ReuseTabService } from '@delon/abc';

import { ITreeOptions } from 'angular-tree-component';

@Component({
    selector: 'biz-page',
    template: `
    `,
    providers: []
})
export class BizPageComponent implements OnInit {

    bizService: BizPageService;
    msgService: NzMessageService;
    reuseTabService: ReuseTabService;

    activatedRoute: ActivatedRoute;
    router: Router;
    pagePath: string;

    queryParams: any = {};

    constructor(injector: Injector) {

        this.activatedRoute = injector.get(ActivatedRoute);
        this.router = injector.get(Router);
        this.bizService = injector.get(BizPageService);
  
        //
        console.log("BizPageComponent init ..............");
    }

    ngOnInit() {

        let len = this.activatedRoute.snapshot.url.length;
        let dir, pageName = "nosetting", cmd;

        dir = this.activatedRoute.snapshot.url[0].path;
        if (len > 1) {
            pageName = this.activatedRoute.snapshot.url[1].path;
        }
        if (len > 2) {
            cmd = this.activatedRoute.snapshot.url[2].path;
        }

        if (len >= 4) {
            //this.parentId = +this.activatedRoute.snapshot.url[3].path;			
        }
        if (dir) {
            dir = "demo";
        }
        if (pageName) {
            pageName = "testRec";
        }
        this.bizService.ajaxGet(`assets/pages/${dir}/${pageName}.json`, {}).subscribe(
            resultData => this.processLoadPageDef(resultData)
        );


    }
    //     
    processLoadPageDef(resultData: any) {

        if (this.reuseTabService) {
            this.reuseTabService.title = resultData["title"];
        }

        //console.log("page def:" , this.queryForm);
    }

    ngOnDestroy() {
        //console.log(" bizQuery ngOnDestory......");				
    }
}
