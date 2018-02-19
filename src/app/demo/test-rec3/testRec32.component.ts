import { Component, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';

import { BizQueryComponent } from '../../../../lib/my-app';
import { TestRecService } from '../test-rec/testRec.service';


@Component({
    selector: 'app-example-testrec',
    templateUrl: './testRec31.component.html'
})
export class TestRec32ListComponent extends BizQueryComponent implements OnInit, OnDestroy {

    constructor(injector: Injector, private service: TestRecService) {
        super(injector);
        this.bizService = service;
    }

    ngOnInit() {
		super.ngOnInit();
		//this.setPageSize(10);
    }
    

	ngOnDestroy(){	
		console.log(" testRec ngOnDestory......");				
    }
    

}
