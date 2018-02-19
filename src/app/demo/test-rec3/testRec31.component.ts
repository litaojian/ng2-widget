import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema } from '../../../../lib/biz-form';
import { BaseListComponent, QueryForm } from '../../../../lib/my-app/my-list.component';
import { TestRecService } from '../test-rec/testRec.service';
import { SimpleTableColumn, SimpleTableButton, SimpleTableFilter } from '../../../../lib/biz-table';


@Component({
    selector: 'app-example-testrec',
    templateUrl: './testRec31.component.html'
})
export class TestRec31ListComponent implements OnInit, OnDestroy {

    url:string;
    //url = `https://randomuser.me/api/?results=3`;

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


    constructor(private msg: NzMessageService, injector: Injector, private service: TestRecService) {
        //super(injector, service);

    }

    ngOnInit() {

        this.loadPageContent();

		//super.ngOnInit();
        
		//this.setPageSize(10);
    }
    
	loadPageContent() {
		//super.ngOnInit();
		//debugger;

        //this.methodContainer = document.getElementById('commentIframe');
		//
		console.log("load page def..............");
        let dir = 'demo';
        let pageName = 'testRec'

        this.service.ajaxGet(`assets/${dir}/${pageName}.json`, {}).subscribe(
            resultData => this.onLoadConfigData(resultData)        
        );		
	}

    onLoadConfigData(resultData:Object){
        this.tableConfig.columns = resultData["table"]['columns'];
        this.tableConfig.dataUrl = resultData["table"]["dataUrl"];
        
    }
	onQuery(): void {
		//super.onQuery(this.queryForm);
	}


	ngOnDestroy(){	
		console.log(" testRec ngOnDestory......");				
    }
    
    format(input:any){
        return input;
    }

}
