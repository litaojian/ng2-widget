import { Observable } from 'rxjs/Observable';
import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute,  Params } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { BaseListComponent, QueryForm } from '../../../../lib/my-app/my-list.component';
import { BaseDetailComponent } from '../../../../lib/my-app/my-detail.component';
import { BaseDataService } from '../../../../lib/base/base-data.service';
import { BizWidgetFactory } from '../../../../lib/biz-widget/biz-widget.factory';

import { TestRec3Service } from './testRec3.service';


@Component({
	template: '<ng-template #target></ng-template>',
	inputs: [],
	outputs: []
})
export class TestRec3ListComponent extends BaseListComponent implements OnInit, OnDestroy {

	@ViewChild('target', {read: ViewContainerRef}) 
	container: ViewContainerRef;
	
	private ref: ComponentRef<any>;

	options_docstatus:Object[] = [];

	schema: Object = {
        properties: {
            email: {
                type: 'string',
                title: '邮箱',
                format: 'email',
                maxLength: 20
            },
            name: {
                type: 'string',
                title: '姓名',
                minLength: 3
            }
        }
	};
	
	constructor(
		private widgetFactory: BizWidgetFactory,
		private cdr: ChangeDetectorRef,
		injector: Injector,
		service: TestRec3Service,
		route: ActivatedRoute,
		router: Router
	) {
		super(injector, service );
	}

	ngOnInit() {

		super.ngOnInit();

		this.setPageSize(10);
	}

	onQuery(): void {
		super.onQuery(this.queryForm);
	}

	ngOnDestroy(){	
		console.log(" testRec ngOnDestory......");				
	}

	ngOnChanges(changes: SimpleChanges): void {
        this.ref = this.widgetFactory.createWidget(this.container, "string");
        //this.onWidgetInstanciated(this.ref.instance);
        this.cdr.detectChanges();
	}

	createComponent(type) {
		this.container.clear(); 
		
	}

}


