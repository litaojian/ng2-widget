import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema } from '..//biz-form';
import { BizFormService } from './biz-form.service';
import { ReuseTabService } from '@delon/abc';

@Component({
    selector: 'app-biz-form',
    template: `
        <my-simple-form #myMainForm layout="inline"
            [schema]="mainForm.schema"
            [model]="mainForm.model"
            [actions]="actions">
        </my-simple-form>
    `,
    providers:[BizFormService]
})
export class BizFormComponent implements OnInit, OnDestroy {

    activatedRoute: ActivatedRoute;
    router: Router;
    bizService:BizFormService;
    msgService: NzMessageService;
    reuseTabService:ReuseTabService;

    pagePath:string;

    actions:any = {
        backto: (form: any) => {
            form.reset({});
        },
        save: (form: any) => {
            //console.log(JSON.stringify(form.value));
            //this.msg.success(JSON.stringify(form.value));                       
        }      
    };

    mainForm:any = {
        schema: null,
        model: {}
    };


    constructor(injector: Injector) {
        this.msgService = injector.get(NzMessageService);
        this.bizService = injector.get(BizFormService);
        this.reuseTabService = injector.get(ReuseTabService);

        this.activatedRoute = injector.get(ActivatedRoute);
        this.router = injector.get(Router);
    
    }

    ngOnInit() {           
        //     
        this.pagePath = "#" + this.router.url;
		
        let len = this.activatedRoute.snapshot.url.length;
        let dir, pageName="nosetting", cmd;

        dir = this.activatedRoute.snapshot.url[0].path;		
		if (len > 1){
            pageName = this.activatedRoute.snapshot.url[1].path;
        }
        if (len > 2){
            cmd = this.activatedRoute.snapshot.url[2].path;		
        }
			
		if (len >= 4){
			//this.parentId = +this.activatedRoute.snapshot.url[3].path;			
		}		
        if (dir){
            dir = "demo";
        }        
        if (pageName){
            pageName = "testRec";
        }
        this.bizService.ajaxGet(`assets/pages/${dir}/${pageName}.json`, {}).subscribe(
            resultData => this.processLoadPageDef(resultData)        
        );	
    }
    //     
    processLoadPageDef(resultData:any){
        
        if (this.reuseTabService){
            this.reuseTabService.title = resultData["title"];
        }

        if (resultData["mainForm"]){
            this.mainForm.schema = {};
            Object.keys(resultData["mainForm"]).forEach((propKey:string) => {
                this.mainForm.schema[propKey] = resultData["mainForm"][propKey];
            });    
        }

        Object.keys(resultData["actions"]).forEach((propKey:string) => {
            this.actions[propKey] = resultData["actions"][propKey];
        });

        this.bizService.setApiUrl(resultData.restAPI);
        this.bizService.setIdField(resultData.idField);
        //set the view url
        this.bizService.setPageViewUrl(this.router.url, "form");

        //console.log("page def:" , this.queryForm);
    }

	ngOnDestroy(){	
		//console.log(" bizQuery ngOnDestory......");				
    }
    

}
