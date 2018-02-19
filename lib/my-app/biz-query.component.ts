import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema } from '..//biz-form';
import { SimpleTableColumn, SimpleTableButton, SimpleTableFilter } from '../biz-table';
import { BizDataService } from './biz-data.service';

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
    providers:[BizDataService]
})
export class BizQueryComponent implements OnInit, OnDestroy {

    url:string;

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

    bizService:BizDataService;
    msgService: NzMessageService;

    constructor(injector: Injector) {
        this.msgService = injector.get(NzMessageService);
        this.bizService = injector.get(BizDataService);
    }

    ngOnInit() {           
        //     
        this.loadPageDef();
    }
    
	loadPageDef() {
		//
		console.log("load page def..............");
        let dir = 'demo';
        let pageName = 'testRec'

        this.bizService.ajaxGet(`assets/${dir}/${pageName}.json`, {}).subscribe(
            resultData => this.processLoadPageDef(resultData)        
        );		
	}

    processLoadPageDef(resultData:Object){
        this.tableConfig.columns = resultData["table"]['columns'];
        this.tableConfig.dataUrl = resultData["table"]["dataUrl"];
        
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
