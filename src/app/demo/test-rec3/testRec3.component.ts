import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema } from '../../../../lib/biz-widget';
import { BaseListComponent, QueryForm } from '../../../../lib/my-app/my-list.component';
import { BaseDetailComponent } from '../../../../lib/my-app/my-detail.component';
import { TestRecService } from '../test-rec/testRec.service';


@Component({
    selector: 'app-example-testrec',
    templateUrl: './testRec3.component.html'
})
export class TestRec3ListComponent extends BaseListComponent implements OnInit, OnDestroy {
    // demo data
    tableData1 = [];

    actions = {
        send: (form: any) => {
            this.msg.success(JSON.stringify(form.value));
        },
        reset: (form: any) => {
            form.reset({});
        }
    };

    // login
    DATA: any = {
        simple: {
            code: '' + require('!!raw-loader!../../schema/login-schema.json'),
            value: {},
            model: { email: 'litaojian@qq.com' }
        }
    };

    constructor(private msg: NzMessageService, injector: Injector, service: TestRecService) {
        super(injector, service);

        Object.keys(this.DATA).forEach(key => {
            this.DATA[key]['schema'] = JSON.parse(this.DATA[key]['code']);
        });
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

}
