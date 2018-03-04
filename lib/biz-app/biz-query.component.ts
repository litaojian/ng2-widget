import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema, FormProperty } from '../biz-form';
import { SimpleTableColumn, SimpleTableButton, SimpleTableFilter } from '../biz-table';
import { BizQueryService } from './biz-query.service';
import { ReuseTabService } from '@delon/abc';

export class BizQueryForm {
    actions = {
        send: (form: any) => {
            console.log(JSON.stringify(form.value));
            //this.msg.success(JSON.stringify(form.value));
        },
        reset: (form: any) => {
            form.reset({});
        }
    };

    schema:Object = {};
    
    model: any = {email: 'litaojian88@qq.com'};
    
    constructor() {
        let jsonForm:string = ''  + require('!!raw-loader!./example/login-schema.json');
        this.schema = JSON.parse(jsonForm);        
    }
}

@Component({
    selector: 'app-biz-query',
    template: `
    <div class="mb-md">
        <nz-input [(ngModel)]="params.testname" name="name" nzPlaceHolder="请输入姓名1" style="width: 100px"></nz-input>
        <button nz-button (click)="st.load(1)" [nzType]="'primary'">搜索</button>
        <button nz-button (click)="params = {}; st.reset()">重置</button>
        <!--  -->
        <button nz-button (click)="st.export()">Export</button>
    </div>
    <div class="mb-md">
        <my-simple-form layout="inline"
                [schema]="queryForm.schema"
                [model]="queryForm.model"
                [actions]="actions">
        </my-simple-form>
    </div>
    <my-simple-table #st [data]="tableConfig.dataUrl" [extraParams]="params" [total]="10" [columns]="tableConfig.columns"
        [resReName]="tableConfig.resReName" showTotal="tableConfig.showTotal">
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

    queryForm:BizQueryForm = new BizQueryForm();

    tableConfig : any = {
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
		
        this.loadPageDef(dir, pageName, cmd);
    }
    
	loadPageDef(dir:string, pageName:string, cmd:string) {
		//
		console.log("load page def..............");
		
		let len = this.activatedRoute.snapshot.url.length;
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

    processLoadPageDef(resultData:any){
        this.tableConfig.columns = resultData["table"]['columns'];
        this.tableConfig.dataUrl = resultData["table"]["dataUrl"];

        this.reuseTabService.title = resultData["title"];
        console.log("page def:" + this.reuseTabService.title);
    }
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
