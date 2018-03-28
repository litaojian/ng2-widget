import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, HostBinding, Injector } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, Params } from '@angular/router';

import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SimpleTableColumn, SimpleTableButton, SimpleTableFilter, SimpleTableComponent } from '../biz-table';
import { BizPageService } from './biz-page.service';
import { ReuseTabService } from '@delon/abc';


@Component({
    selector: 'biz-dialog',
    template: `
    `,
    providers: []
})
export class BizDialogComponent {

    bizService: BizPageService;
    msgService: NzMessageService;
    modalService: NzModalService;
    
    reuseTabService: ReuseTabService;
    
    activatedRoute: ActivatedRoute;
    router: Router;
    pagePath: string;

    actions: any = {
        reset: (form: any) => {
            form.reset({});
		}
    };
    
    constructor(injector: Injector) {

        this.activatedRoute = injector.get(ActivatedRoute);
        this.router = injector.get(Router);
        this.bizService = injector.get(BizPageService);
        this.msgService = injector.get(NzMessageService);
        this.modalService = injector.get(NzModalService);
        
        //
        console.log("BizDialogComponent init ..............");
    }

    ngOnInit() {     
        //console.log("BizPageComponent ngOnInit ..............");
        this.loadPageDef();
    }
    
    ngOnDestroy() {
        //console.log(" bizQuery ngOnDestory......");				
    }

    getUrl(route: ActivatedRouteSnapshot): string {
        let next = route;
        while (next.firstChild){
            next = next.firstChild;
        } 

        const segments = [];
        while (next) {
            segments.push(next.url.join('/'));
            next = next.parent;
        }
        const url = '/' + segments.filter(i => i).reverse().join('/');
        return url;
    }

    ngDoCheck() {
        //console.log("ngDoCheck ......");
        this.loadPageDef();
    }

    loadPageDef(){
        
        let _url = this.bizService.pageUrl;

        if (_url != this.pagePath){
            this.pagePath = _url;
            //
            //console.log("BizPageComponent loadPageDef .............." + this.router.url );                
            let urls = this.bizService.pageUrl.split("/");
            let len = urls.length;
            let dir, pageName, cmd;            
            if (urls.length > 0){
                if (urls[0] == ""){
                    urls.shift();   
                }
                dir = urls[0];
                if (urls.length > 1) {
                    pageName = urls[1];
                }        
                if (urls.length > 2) {
                    cmd = urls[2];
                }
            }

            if (!dir) {
                dir = "demo";
            }
            if (!pageName) {
                pageName = "testDialog";
            }

            this.bizService.ajaxGet(`assets/pages/${dir}/${pageName}.json`, {}).subscribe(
                (resultData:any) => {

                    this.onPageInit(resultData, this.bizService.pageUrl);                    
                }
            );

        }   
    }
    //     
    onPageInit(resultData: any, url:string) {

        if (this.reuseTabService) {
            this.reuseTabService.title = resultData["title"];
        }
        //console.log("page def:" , this.queryForm);
    }


}
