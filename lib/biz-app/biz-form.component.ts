import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema } from '..//biz-form';
import { BizFormService } from './biz-form.service';

@Component({
    selector: 'app-biz-form',
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
    providers:[BizFormService]
})
export class BizFormComponent implements OnInit, OnDestroy {

    activatedRoute: ActivatedRoute;
    router: Router;
    bizService:BizFormService;
    msgService: NzMessageService;

    pagePath:string;
    params: any = {};

    constructor(injector: Injector) {
        this.msgService = injector.get(NzMessageService);
        this.bizService = injector.get(BizFormService);

        this.activatedRoute = injector.get(ActivatedRoute);
        this.router = injector.get(Router);
    
    }

    ngOnInit() {           
        //     
        this.loadPageDef();
    }
    
	loadPageDef() {
		//
		console.log("load page def..............");
        //let dir = 'demo';
        //let pageName = 'testRec'

        this.pagePath = "#" + this.router.url;
		
		let len = this.activatedRoute.snapshot.url.length;
		let dir = this.activatedRoute.snapshot.url[0].path;		
		let pageName = this.activatedRoute.snapshot.url[1].path;
		let cmd = this.activatedRoute.snapshot.url[2].path;		
		if (len >= 4){
			//this.parentId = +this.activatedRoute.snapshot.url[3].path;			
		}		
        
        
        this.bizService.ajaxGet(`assets/${dir}/${pageName}.json`, {}).subscribe(
            resultData => this.processLoadPageDef(resultData)        
        );		
	}

    processLoadPageDef(resultData:Object){
        
        
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
