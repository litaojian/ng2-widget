import { Component, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';

import { BizQueryComponent } from '../../../../lib/my-app';
import { TestRecService } from '../test-rec/testRec.service';
import { BizTreeTableComponent } from '@yg-widget/biz-app';


@Component({
    selector: 'biz-org',
    templateUrl: './biz-org.component.html'
})
export class BizOrganizationComponent extends BizTreeTableComponent implements OnInit, OnDestroy {
     
    constructor(injector: Injector, private service: TestRecService) {
        super(injector);
        this.bizService = service;
        console.log("BizOrganizationComponent init .........");
    }

    ngOnInit() {
		super.ngOnInit();
		//this.setPageSize(10);
    }
    

	ngOnDestroy(){	
		//console.log(" testRec ngOnDestory......");				
    }
    

}
