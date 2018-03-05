import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema, FormProperty } from '../biz-form';
import { SimpleTableColumn, SimpleTableButton, SimpleTableFilter } from '../biz-table';
import { BizQueryService } from './biz-query.service';
import { ReuseTabService } from '@delon/abc';

@Component({
    selector: 'app-biz-query',
    template: `
    <div class="mb-md">
        <my-simple-form layout="inline"
                [schema]="queryForm.schema"
                [model]="queryForm.model"
                [actions]="actions">
        </my-simple-form>
    </div>
    <my-simple-table #st [data]="dataTable.dataUrl" [extraParams]="params" [total]="10" [columns]="dataTable.columns"
        [resReName]="dataTable.resReName" showTotal="dataTable.showTotal">
    </my-simple-table>
    `,
    providers:[]
})
export class BizQueryComponent implements OnInit, OnDestroy {

    activatedRoute: ActivatedRoute;
    router: Router;
    bizService:BizQueryService;
    msgService: NzMessageService;
    reuseTabService:ReuseTabService;
    pagePath:string;
    params: any = {};
    
    actions:any = {
        query: (form: any) => {
            console.log(JSON.stringify(form.value));
            //this.msg.success(JSON.stringify(form.value));
        },        
        reset: (form: any) => {
            form.reset({});
        }
        ,        
        add: (form: any) => {
            console.log("add:" + JSON.stringify(form.value));
        }
    };

    queryForm:any = {
        schema: null,
        model: {}
    };

    dataTable : any = {
        dataUrl:'',
        reqMehtod:"GET",
        showTotal:true,
        resReName : {list: 'rows', total:'total'},
        columns : [
            {title:"ID"}
        ]    
    }
 

    constructor(injector: Injector) {
        this.msgService = injector.get(NzMessageService);
        this.bizService = injector.get(BizQueryService);
        this.reuseTabService = injector.get(ReuseTabService);
        this.activatedRoute = injector.get(ActivatedRoute);
        this.router = injector.get(Router);

        console.log("BizQueryComponent init ..............");		
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
        //this.dataTable.columns = resultData["dataTable"]['columns'];
        //this.dataTable.dataUrl = resultData["dataTable"]["dataUrl"];
        this.queryForm.schema = resultData["queryForm"];
  
        Object.keys(resultData["dataTable"]).forEach((propKey:string) => {
             this.dataTable[propKey] = resultData["dataTable"][propKey];
        });
        
        Object.keys(resultData["actions"]).forEach((propKey:string) => {
            this.actions[propKey] = resultData["actions"][propKey];
        });

        if (this.reuseTabService){
            this.reuseTabService.title = resultData["title"];
        }
        //console.log("page def:" , this.queryForm);
    }
    //
	onQuery(): void {
		//super.onQuery(this.queryForm);
	}

	ngOnDestroy(){	
		//console.log(" bizQuery ngOnDestory......");				
    }
    
    format(input:any){
        return input;
    }

}
