import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema } from '../biz-form';
import { SimpleTableColumn, SimpleTableButton, SimpleTableFilter } from '../biz-table';
import { BizQueryService } from './biz-query.service';
import { ReuseTabService } from '@delon/abc';


@Component({
    selector: 'app-biz-query',
    template: `
    <div class="mb-md">
        <nz-input [(ngModel)]="params.testname" name="name" nzPlaceHolder="请输入姓名" style="width: 100px"></nz-input>
        <button nz-button (click)="st.load(1)" [nzType]="'primary'">搜索</button>
        <button nz-button (click)="params = {}; st.reset()">重置</button>
        <!--  -->
        <button nz-button (click)="st.export()">Export</button>
    </div>
    <simple-table #st [data]="tableConfig.dataUrl" [extraParams]="params" [total]="10" [columns]="tableConfig.columns"
        [resReName]="tableConfig.resReName" showTotal="tableConfig.showTotal">
    </simple-table>
    `,
    providers:[BizQueryService]
})
export class BizQueryComponent implements OnInit, OnDestroy {

    activatedRoute: ActivatedRoute;
    router: Router;
    bizService:BizQueryService;
    msgService: NzMessageService;
    reuseTabService:ReuseTabService;
    pagePath:string;
    params: any = {};

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
