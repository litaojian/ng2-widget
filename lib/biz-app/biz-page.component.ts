import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, HostBinding, Injector } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SimpleTableColumn, SimpleTableButton, SimpleTableFilter, SimpleTableComponent } from '../biz-table';
import { BizPageService } from './biz-page.service';
import { ReuseTabService } from '@delon/abc';


@Component({
    selector: 'biz-page',
    template: `
    `,
    providers: []
})
export class BizPageComponent {

    bizService: BizPageService;
    msgService: NzMessageService;
    reuseTabService: ReuseTabService;

    activatedRoute: ActivatedRoute;
    router: Router;
    pagePath: string;

    constructor(injector: Injector) {

        this.activatedRoute = injector.get(ActivatedRoute);
        this.router = injector.get(Router);
        this.bizService = injector.get(BizPageService);
  
        //
        console.log("BizPageComponent init ..............");
    }

    ngOnInit() {     
        //console.log("BizPageComponent ngOnInit ..............");
    }

    ngDoCheck() {
        if (this.router.url != this.pagePath){
            this.pagePath = this.router.url;
            console.log("BizPageComponent ngDoCheck .............." + this.router.url );                
            
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
            if (!dir) {
                dir = "demo";
            }
            if (!pageName) {
                pageName = "testRec";
            }

            this.bizService.ajaxGet(`assets/pages/${dir}/${pageName}.json`, {}).subscribe(
                (resultData:any) => {
                    let url = this.router.url;
                    if (resultData["navTree"] && url.endsWith("/list")){
                        url = url.replace("/list", "/tree");            
                        this.router.navigateByUrl(url);
                    }else{
                        this.onPageInit(resultData);
                    }
                }
            );

        }    
    }
    
    //     
    onPageInit(resultData: any) {

        if (this.reuseTabService) {
            this.reuseTabService.title = resultData["title"];
        }
        //console.log("page def:" , this.queryForm);
    }

    ngOnDestroy() {
        //console.log(" bizQuery ngOnDestory......");				
    }
}
