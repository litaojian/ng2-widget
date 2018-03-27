import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, HostBinding, Injector } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, Params } from '@angular/router';

import { NzMessageService, NzModalService } from 'ng-zorro-antd';
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
        console.log("BizPageComponent init ..............");
    }

    ngOnInit() {     
        //console.log("BizPageComponent ngOnInit ..............");
        this.loadPageDef();
    }
    
    ngOnDestroy() {
        //console.log(" bizQuery ngOnDestory......");				
    }

    // ngAfterViewInit(){
    // }

    // ngAfterContentInit(){
    // }

    // ngOnChanges(){
    // }

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
        let _url = this.getUrl(this.activatedRoute.snapshot);
        if (_url != this.pagePath){
            this.pagePath = _url;
            //
            //console.log("BizPageComponent loadPageDef .............." + this.router.url );                
            
            let len = this.activatedRoute.snapshot.url.length;
            let dir, pageName, cmd;
            if (len == 0){
                //console.log("debug:--------------" + this.bizService.pageUrl);
                let urls = this.bizService.pageUrl.split("/");
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
            }else{
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
                        this.onPageInit(resultData, url);
                    }
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
