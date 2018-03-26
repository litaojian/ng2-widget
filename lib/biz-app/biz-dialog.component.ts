import { Component, ViewContainerRef, ChangeDetectorRef, ComponentRef, SimpleChanges, ViewChild, OnInit, HostBinding, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema } from '..//biz-form';
import { BizDialogService } from './biz-dialog.service';
import { BizQueryComponent } from './biz-query.component';
import { BizFormComponent } from './biz-form.component';


@Component({
    selector: 'bizquery-dialog',
    template: `
        <p>query table dialog </p>
    `
})
export class BizQueryDialogComponent extends BizQueryComponent {

    constructor(injector: Injector) {
        super(injector);
    
    }

    

}



@Component({
    selector: 'bizform-dialog',
    template: `
        <p>form dialog </p>
    `
})
export class BizFormDialogComponent extends BizFormComponent {

    constructor(injector: Injector) {
        super(injector);    
    }

    

}


@Component({
    selector: 'bizform-dialog',
    template: `
        <p>tree dialog </p>
    `
})
export class BizTreeDialogComponent {

    constructor(injector: Injector) {
        //this.msgService = injector.get(NzMessageService);
        //this.bizService = injector.get(BizDialogService);

        //this.activatedRoute = injector.get(ActivatedRoute);
        //this.router = injector.get(Router);
    
    }

    

}