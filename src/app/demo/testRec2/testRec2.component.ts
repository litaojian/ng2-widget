import { Observable } from 'rxjs/Observable';
import { Component, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { BaseListComponent, QueryForm } from '../../../../lib/my-app/my-list.component';
import { BaseDetailComponent } from '../../../../lib/my-app/my-detail.component';
import { BaseDataService } from '../../../../lib/base/base-data.service';

import { TestRecService } from './testRec2.service';


@Component({
	//moduleId: module.id,
	templateUrl: './testRec-list.html',
	inputs: [],
	outputs: []
})
export class TestRecListComponent extends BaseListComponent implements OnInit, OnDestroy {


	options_docstatus:Object[] = [];

	constructor(
		injector: Injector,
		service: TestRecService,
		route: ActivatedRoute,
		router: Router
	) {
		super(injector, service );
	}

	ngOnInit() {

		super.ngOnInit();
		
		this.options_docstatus.push({"value":"1", "label":"text1"});
		this.options_docstatus.push({"value":"2", "label":"text2"});
		this.options_docstatus.push({"value":"APPR", "label":"已审核2"});

		this.setPageSize(10);
	}

	onQuery(): void {
		super.onQuery(this.queryForm);
	}

	ngOnDestroy(){	
		console.log(" testRec ngOnDestory......");				
	}

}



@Component({
	//moduleId: module.id,
	templateUrl: './testRec-detail.html',
	styles: [],  
	animations: []
})
export class TestRecDetailComponent extends BaseDetailComponent implements OnInit, AfterViewInit {
	
	i: any;
	cat: string[] = [ '美食', '美食,粤菜', '美食,粤菜,湛江菜' ];
	
	constructor(
		injector:Injector,
		service: TestRecService,
		activatedRoute: ActivatedRoute,
		router: Router,
		location: Location
	) {
		super(injector, service);
	}

	ngOnInit() {
		super.ngOnInit();
	
		this.formGroup = this.formBuilder.group({
            name: [null, [Validators.required]],
            url: [null, [Validators.required]],
            owner: [undefined, [Validators.required]],
            approver : [null, [Validators.required]],
            time_start : [null, [Validators.required]],
            time_end : [null, [Validators.required]],
            type : [null, [Validators.required]],
            name2 : [null, [Validators.required]],
            summary : [null, [Validators.required]],
            owner2 : [null, [Validators.required]],
            approver2 : [null, [Validators.required]],
            time : [null, [Validators.required]],
            type2 : [null, [Validators.required]],
            items: this.formBuilder.array([])
        });
	}


	ngAfterViewInit() {

	}

}

